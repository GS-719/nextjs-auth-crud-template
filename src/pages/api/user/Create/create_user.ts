"Imports"
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        return res.status(200).json({ message: "The Get request" });
    } else if (req.method === "POST") {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        if (!name || !email || !password) {
            console.log(`Please provide the name, email and the password`);
            return res.status(200).json({ message: "Please provide the name, email and the password" });
        }

        const refinded_email = email.toLowerCase().trim();
        try {
            const user_exists = await prisma.user.findUnique({
                where: { email: refinded_email }
            })

            if (user_exists) {
                const existing_user_data = {
                    id: user_exists.id,
                    name: user_exists.name,
                    email: user_exists.email,
                }
                console.log(`User already exists, ${existing_user_data}, please log in`);
                return res.status(200).json({ message: "User already exists", user_exists });
            }

            const hashed_password = await bcrypt.hash(password, 10);

            const new_user = await prisma.user.create({
                data: {
                    name,
                    email: refinded_email,
                    password: hashed_password
                }
            })

            if (!new_user) {
                console.log("Failed to create new User");
                return res.status(200).json({ message: "Failed to create new User, Please try again..." })
            }

            console.log("User Created Successfully...")
            console.log(`This is the new created user: ${new_user}`)
            return res.status(201).json({
                message: "User Created Successfully...",
                new_user
            })

        } catch (error) {
            console.error(`Error while performing prisma queries`);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}