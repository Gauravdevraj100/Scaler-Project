"use client";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import netflix from "@/assets/netflix.png";

function Header() {
    const router = useRouter();
    const { data: session } = useSession();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent z-50">
            <nav className="flex justify-between items-center py-3 px-4 w-full">
                <div className="w-6/12 ml-4">
                    <Image
                        src={netflix}
                        alt="logo"
                        className="w-5/12 md:w-2/12 cursor-pointer"
                        onClick={() => router.push("/movies")}
                        width={50}
                        height={50}
                    />
                </div>

                <div className="mr-4">
                    {!session ? (
                        <button
                            className="bg-red-600 hover:bg-red-700 py-2 px-4 text-white rounded-md transition duration-200"
                            onClick={() => router.push("/login")}
                        >
                            Sign In
                        </button>
                    ) : (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white hover:ring-2 hover:ring-white transition duration-200"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <span className="text-lg">
                                    {session.user?.name?.[0]?.toUpperCase() ||
                                        "U"}
                                </span>
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-black border border-gray-700 rounded-md shadow-lg">
                                    <div className="py-1">
                                        <p className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                                            {session.user?.name}
                                        </p>
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition duration-200"
                                            onClick={() => signOut()}
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
}

export default Header;
