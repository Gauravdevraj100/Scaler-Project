import "next-auth";

declare module "next-auth" {
    interface User {
        token: string;
        name?: string | null;
        email?: string | null;
    }

    interface Session {
        user: User;
        token: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        token: string;
    }
} 