// pages/api/users/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth_guard";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await requireAuth(req, res);
    if (!session) return;

    const { id } = req.query;

    if (session.user?.role === "ADMIN") {
        try {
            const user = await prisma.user.findUnique({
                where: { id: String(id) },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                },
            });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json(user);
        } catch (error) {
            console.log(`Error: ${error}`);
        }

    } else {
        return res.status(405).json({ message: "Please Login as ADMIN" });
    }
}
