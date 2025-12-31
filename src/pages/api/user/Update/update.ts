import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth_guard";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "PUT") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const session = await requireAuth(req, res);
    if (!session) return;

    const { id, name, role } = req.body;

    if (!id) {
        return res.status(400).json({ message: "User ID is required" });
    }

    const isAdmin = session?.user?.role === "ADMIN";
    const isSelf = session?.user?.id === id;

    // ❌ Block unauthorized updates
    if (!isAdmin && !isSelf) {
        return res.status(403).json({ message: "Forbidden" });
    }

    // ❌ Prevent role escalation
    if (!isAdmin && role) {
        return res.status(403).json({ message: "Cannot change role" });
    }

    const updatedUser = await prisma.user.update({
        where: { id },
        data: {
            ...(name && { name }),
            ...(isAdmin && role && { role }),
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            updatedAt: true,
        },
    });

    return res.status(200).json(updatedUser);
}
