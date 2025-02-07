import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error("Please enter your username and password");
                }

                try {
                    const res = await fetch(
                        "https://movie-stream-egha.onrender.com/login/",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                username: credentials.username,
                                password: credentials.password,
                            }),
                        }
                    );

                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error("Invalid credentials");
                    }

                    // Return user object with the token
                    return {
                        id: credentials.username,
                        name: credentials.username,
                        email: credentials.username,
                        token: data.token,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    throw error;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // This runs when user logs in - store the token
                token.token = user.token;
            }
            return token;
        },
        async session({ session, token }) {
            // Send token to client
            session.token = token.token;
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: { strategy: "jwt" },
});

export { handler as GET, handler as POST };
