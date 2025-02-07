"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import background_netflix from "@/assets/background_netflix.jpg";
import tv from "@/assets/tv.png";
import mobile from "@/assets/mobile-0819.jpg";
import netflix_kid from "@/assets/netflix_kid.png";

export default function Home() {
    const router = useRouter();
    return (
        <div className="grid items-center justify-items-center min-h-screen pb-20 font-[family-name:var(--font-geist-sans)]">
            <div
                className="min-h-[100vh] min-w-[100vw] bg-black bg-opacity-65 showcase border-gray-600 border-b-8 flex justify-center items-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${background_netflix.src})`,
                    backgroundColor: "rgba(0,0,0,0.70)",
                    backgroundBlendMode: "multiply",
                }}
            >
                <div className="z-10 h-full py-32 md:py-0 text-gray-100 text-center flex items-center flex-col">
                    <h1 className="font-semibold text-4xl md:text-5xl w-10/12 md:w-3/4 text-center">
                        Unlimited movies, TV shows, and more.
                    </h1>
                    <h3 className="text-xl md:text-xl py-5">
                        Watch anywhere. Cancel anytime.
                    </h3>
                    <h4 className="text-sm md:text-lg pb-3">
                        Ready to watch? Register here
                    </h4>

                    <div className="w-full flex justify-center">
                        <div className="flex justify-center items-center w-11/12 md:w-10/12">
                            {/* <input
                                    type="email"
                                    name=""
                                    id=""
                                    placeholder="Email address"
                                    className="md:py-5 py-4 px-2 placeholder-gray-500 rounded-tl-sm rounded-bl-sm outline-none  text-gray-900 bg-gray-50 block w-8/12 md:w-3/4"
                                /> */}
                            <button
                                className="bg-red-500 font-medium md:font-normal md:w-1/4 flex justify-center items-center py-4 px-1 md:px-0 rounded-br-sm rounded-tr-sm md:text-2xl rounded-md"
                                onClick={() => router.push("/login")}
                            >
                                <span>Get Started</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <section className="flex flex-col md:flex-row items-center border-gray-900 border-b-8 min-height: 70vh">
                <div className="md:w-1/2 flex flex-col justify-center text-center md:text-left p-5 md:p-10 ">
                    <h2 className="md:text-5xl text-4xl font-semibold mb-4">
                        Enjoy on your TV.
                    </h2>
                    <h5 className="md:text-xl text-lg">
                        Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple
                        TV, Blu-ray players, and more.
                    </h5>
                </div>
                <div className="md:w-1/2 flex justify-center items-center">
                    <Image
                        src={tv}
                        className="w-8/12"
                        alt=""
                        width={200}
                        height={200}
                    />
                </div>
            </section>

            <section className="flex flex-col md:flex-row items-center border-gray-900 border-b-8 min-height: 70vh">
                <div className="md:w-1/2 flex justify-center items-center order-2">
                    <Image
                        src={mobile}
                        className="w-8/12"
                        alt=""
                        width={180}
                        height={180}
                    />
                </div>

                <div className="md:w-1/2 flex flex-col justify-center text-center md:text-left p-5 md:p-10">
                    <h2 className="md:text-5xl text-4xl font-semibold mb-4">
                        Download your shows to watch offline.
                    </h2>
                    <h5 className="md:text-xl text-lg">
                        Save your favorites easily and always have something to
                        watch.
                    </h5>
                </div>
            </section>

            <section className="flex flex-col md:flex-row items-center border-gray-900 border-b-8 min-height: 70vh">
                <div className="md:w-1/2 flex flex-col justify-center text-center md:text-left p-5 md:p-10">
                    <h2 className="md:text-5xl text-4xl font-semibold mb-4">
                        Create profiles for kids.
                    </h2>
                    <h5 className="md:text-xl text-lg">
                        Send kids on adventures with their favorite characters
                        in a space made just for them—free with your membership.
                    </h5>
                </div>
                <div className="md:w-1/2 flex justify-center items-center">
                    <Image
                        src={netflix_kid}
                        className="w-8/12"
                        alt=""
                        width={100}
                        height={100}
                    />
                </div>
            </section>
            <footer className=" px-5 py-10 ">
                <ul className="flex justify-between items-center">
                    <li>&copy; All Right Reserved | 2022</li>
                    <li> Netflix Clone</li>
                    <li>By: Destiny Franks - Desphixs</li>
                </ul>
            </footer>
        </div>
    );
}
