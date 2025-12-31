import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id?: string;
            role?: "ADMIN" | "USER";
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }

    interface User {
        role?: "ADMIN" | "USER";
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: "ADMIN" | "USER";
    }
}
