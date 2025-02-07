"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/store/api";
import { signIn } from "next-auth/react";
import background_netflix from "@/assets/background_netflix.jpg";

function Register() {
    const router = useRouter();
    const [register, { isLoading }] = useRegisterMutation();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await register({
                first_name: formData.firstName,
                last_name: formData.lastName,
                username: formData.email,
                password: formData.password,
            }).unwrap();

            console.log("first");

            // After successful registration, attempt to login
            const result = await signIn("credentials", {
                username: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                setError(
                    "Registration successful but login failed. Please try logging in manually."
                );
                router.push("/login");
            } else {
                router.push("/movies");
                router.refresh();
            }

            router.push("/login");
        } catch (err: any) {
            setError(err.data?.message || "Registration failed");
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
                <h1 className="text-white text-3xl font-bold mb-8">Sign Up</h1>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            placeholder="First name"
                            className="p-4 rounded-md bg-[#333] text-white focus:outline-none focus:ring-2 focus:ring-gray-500 w-1/2"
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            placeholder="Last name"
                            className="p-4 rounded-md bg-[#333] text-white focus:outline-none focus:ring-2 focus:ring-gray-500 w-1/2"
                            onChange={handleChange}
                        />
                    </div>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        placeholder="Email address"
                        className="p-4 rounded-md bg-[#333] text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        placeholder="Add a password"
                        className="p-4 rounded-md bg-[#333] text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        placeholder="Confirm password"
                        className="p-4 rounded-md bg-[#333] text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                        onChange={handleChange}
                    />
                    <button
                        type="submit"
                        className="bg-[#e50914] text-white p-4 rounded-md font-semibold mt-8 hover:bg-[#f6121d] transition"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing up..." : "Sign Up"}
                    </button>
                    <div className="mt-4 text-[#b3b3b3] text-sm">
                        <p>
                            By signing up, you agree to our{" "}
                            <a href="#" className="text-white hover:underline">
                                Terms of Use
                            </a>{" "}
                            and{" "}
                            <a href="#" className="text-white hover:underline">
                                Privacy Policy
                            </a>
                            .
                        </p>
                    </div>
                    <div className="mt-4 text-[#b3b3b3]">
                        <p>
                            Already have an account?{" "}
                            <a
                                href="/login"
                                className="text-white hover:underline"
                            >
                                Sign in now
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
