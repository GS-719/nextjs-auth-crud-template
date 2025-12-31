import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth_guard";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "DELETE") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const session = await requireAuth(req, res);
    if (!session) return;

    const { id, confirm } = req.body;

    if (!id || confirm !== true) {
        return res.status(400).json({ message: "Confirmation required" });
    }

    const isAdmin = session?.user?.role === "ADMIN";
    const isSelf = session?.user?.id === id;

    if (!isAdmin && !isSelf) {
        return res.status(403).json({ message: "Forbidden" });
    }

    // Optional safety: prevent deleting the last admin
    if (isAdmin) {
        const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
        if (adminCount <= 1) {
            return res.status(400).json({ message: "Cannot delete the last admin" });
        }
    }

    await prisma.user.delete({
        where: { id },
    });

    return res.status(200).json({ message: "User deleted successfully" });
}
