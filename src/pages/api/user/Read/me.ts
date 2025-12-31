import { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/auth_guard";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const session = await requireAuth(req, res);

    if (!session) return null;

    if (req.method === "GET") {
        try {
            const user = await prisma.user.findUnique({
                where: { email: session.user?.email! },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                },
            })
            return res.status(200).json(user);
        } catch (error) {
            console.error(`Error while fetching user form the database: ${error}`);
            return res.status(500).json({ message: "Error while fetching user form the database", error });
        }
    }
}