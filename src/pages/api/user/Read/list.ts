import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth_guard";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await requireAuth(req, res);
    if (!session) return;

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const skip = (page - 1) * limit;

    if (req.method === "GET") {
        if (session.user.role === "ADMIN") {
            const [users, total] = await Promise.all([
                prisma.user.findMany({
                    skip,
                    take: limit,
                    orderBy: { createdAt: "desc" },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        createdAt: true,
                    },
                }),
                prisma.user.count(),
            ]);

            res.status(200).json({
                data: users,
                meta: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            });
        } else {
            return res.status(200).json({ message: "Please Login as ADMIN" })
        }
    } else {
        return res.status(200).json({ message: "method not allowed" })
    }
}
