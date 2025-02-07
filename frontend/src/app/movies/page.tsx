"use client";
import { useGetMoviesQuery, useGetGenresQuery } from "@/store/api";
import { Movie } from "@/types/types";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { StarRating } from "@/components/StarRating";

function MoviesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const { data: genres = [] } = useGetGenresQuery();
    const {
        data: movies,
        isLoading,
        error,
    } = useGetMoviesQuery({
        search: searchTerm,
        genre: selectedGenre,
        year: selectedYear,
    });

    // Add debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {}, 500); // 500ms delay

        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedGenre, selectedYear]);

    const years = Array.from({ length: 2024 - 2000 + 1 }, (_, i) => 2024 - i);
    const router = useRouter();

    const MovieCard = ({ movie }: { movie: Movie }) => (
        <div
            className="relative h-[400px] rounded-xl overflow-hidden hover:scale-105 transition duration-300 cursor-pointer"
            onClick={() => {
                router.push(`/movies/${movie.id}`);
            }}
        >
            <Image
                src={movie.cover_image || "/assets/vikings.jpg"}
                alt={movie.title}
                className="w-full h-full object-cover"
                width={200}
                height={500}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent">
                <div className="absolute bottom-0 p-4 w-full">
                    <h3 className="text-white text-xl font-bold mb-2">
                        {movie.title}
                    </h3>
                    <div className="mb-2">
                        <StarRating rating={movie.average_rating} />
                    </div>
                    <div className="flex gap-2 mb-2">
                        <span className="text-gray-200 text-sm">
                            {movie.release_date}
                        </span>
                        <span className="text-gray-200 text-sm">•</span>
                        <span className="text-gray-200 text-sm">
                            {movie.duration}
                        </span>
                    </div>
                    <p className="text-gray-200 text-sm mb-2 line-clamp-2">
                        {movie.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {movie.genres.map((genre, index) => (
                            <span
                                key={index}
                                className="bg-[#333] text-white text-xs px-2 py-1 rounded"
                            >
                                {genre.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading movies</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white p-6">
            {/* Header with Search and Filters */}
            <div className="max-w-7xl mx-auto mb-8 mt-10">
                <h1 className="text-3xl font-bold mb-6">Movies</h1>

                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Search movies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow p-3 rounded-md bg-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#e50914]"
                    />

                    {/* Genre Filter */}
                    <select
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        className="p-3 rounded-md bg-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#e50914] min-w-[150px]"
                    >
                        <option value="">All Genres</option>
                        {genres.map((genre) => (
                            <option key={genre.id} value={genre.name}>
                                {genre.name}
                            </option>
                        ))}
                    </select>

                    {/* Year Filter */}
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="p-3 rounded-md bg-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#e50914] min-w-[150px]"
                    >
                        <option value="">All Years</option>
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Movies Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {movies?.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MoviesPage;
