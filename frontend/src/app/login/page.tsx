"use client";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, Suspense } from "react";
import background_netflix from "@/assets/background_netflix.jpg";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                username,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid username or password");
            } else {
                const from = searchParams.get("from") || "/movies";
                router.push(from);
                router.refresh();
            }
        } catch (error) {
            setError("An error occurred during login");
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-[100vh] min-w-[100vw] bg-black bg-opacity-65 showcase border-gray-600 border-b-8 flex justify-center items-center bg-no-repeat"
            style={{
                backgroundImage: `url(${background_netflix.src})`,
                backgroundColor: "rgba(0,0,0,0.70)",
                backgroundBlendMode: "multiply",
            }}
        >
            <div className="bg-black bg-opacity-70 p-10 rounded-md min-w-[450px]">
                <h1 className="text-white text-3xl font-bold mb-8">Log In</h1>
                {error && (
                    <div className="bg-[#e87c03] text-white p-4 rounded-md mb-4">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Username or phone number"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="p-4 rounded-md bg-[#333] text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                        disabled={isLoading}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-4 rounded-md bg-[#333] text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="bg-[#e50914] text-white p-4 rounded-md font-semibold mt-8 hover:bg-[#f6121d] transition disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Log In"}
                    </button>
                    <div className="flex justify-between text-[#b3b3b3] text-sm mt-2">
                        <div className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <label>Remember me</label>
                        </div>
                    </div>
                    <div className="mt-4 text-[#b3b3b3]">
                        <p>
                            New to Netflix?{" "}
                            <a
                                href="/register"
                                className="text-white hover:underline"
                            >
                                Sign up now
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Login() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}

export default Login;