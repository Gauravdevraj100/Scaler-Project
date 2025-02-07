"use client";
import {
    useGetMovieByIdQuery,
    useGetMovieReviewsQuery,
    useAddMovieReviewMutation,
} from "@/store/api";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { StarRating } from "@/components/StarRating";
import { api } from "@/store/api";
import YouTube from "react-youtube";

function MovieDetailPage() {
    const params = useParams();
    const movieId = params.id as string;
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [hoverRating, setHoverRating] = useState(0);
    const [showVideo, setShowVideo] = useState(false);

    const { data: movie, isLoading, error } = useGetMovieByIdQuery(movieId);
    const { data: reviews = [] } = useGetMovieReviewsQuery(movieId);
    const [addReview] = useAddMovieReviewMutation();

    const getYoutubeId = (url: string): string => {
        try {
            if (url.includes("youtu.be/")) {
                return url.split("youtu.be/")[1].split("?")[0];
            } else if (url.includes("youtube.com/watch")) {
                const urlParams = new URLSearchParams(new URL(url).search);
                return urlParams.get("v") || "";
            }
            return "";
        } catch (error) {
            console.error("Error parsing YouTube URL:", error);
            return "";
        }
    };

    const opts = {
        height: "100%",
        width: "100%",
        playerVars: {
            autoplay: 1,
            modestbranding: 1,
            controls: 1,
        },
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white">Error loading movie details</div>
            </div>
        );
    }

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addReview({
                movieId,
                rating,
                comment,
            }).unwrap();

            // Update the movie cache to reflect that the user has reviewed
            api.util.updateQueryData("getMovieById", movieId, (draft) => {
                if (draft) {
                    draft.has_user_reviewed = true;
                }
            });

            // Clear form
            setRating(5);
            setComment("");
        } catch (error) {
            console.error("Failed to add review:", error);
        }
    };

    return (
        <div className="min-h-screen bg-black">
            {/* Video Modal */}
            {showVideo && movie.video && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 w"
                    onClick={() => setShowVideo(false)}
                >
                    <div
                        className="relative  w-[80vw] h-[85vh] aspect-video"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowVideo(false)}
                            className="absolute -top-10 right-[-100px] text-white hover:text-gray-300"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <div className="w-full h-full">
                            <YouTube
                                videoId={getYoutubeId(movie.video)}
                                opts={opts}
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Hero Section with Backdrop */}
            <div
                className="relative h-[80vh] w-full bg-cover bg-center"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.9)), url(${
                        movie.cover_image || "/assets/vikings.jpg"
                    })`,
                }}
            >
                <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        {movie.title}
                    </h1>
                    <div className="flex items-center gap-4 mb-4">
                        <StarRating rating={movie.average_rating} />
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-300">
                            {movie.release_date}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-300">{movie.duration}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mb-6">
                        {movie.video && (
                            <button
                                className="bg-[#e50914] hover:bg-[#f6121d] text-white px-8 py-3 rounded-md flex items-center gap-2 transition"
                                onClick={() => setShowVideo(true)}
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Watch Now
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Movie Details Section */}
            <div className="max-w-7xl mx-auto px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column - Description */}
                    <div className="md:col-span-2">
                        <h2 className="text-white text-2xl font-bold mb-4">
                            Synopsis
                        </h2>
                        <p className="text-gray-300 mb-8">
                            {movie.description}
                        </p>
                    </div>

                    {/* Right Column - Additional Details */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-white text-lg font-semibold mb-2">
                                Cast
                            </h3>
                            <div className="text-gray-300">
                                {movie.star_cast}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white text-lg font-semibold mb-2">
                                Genres
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {movie.genres.map((genre, index) => (
                                    <span
                                        key={index}
                                        className="bg-[#333] text-white text-sm px-3 py-1 rounded-full"
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {/* <div>
                            <h3 className="text-white text-lg font-semibold mb-2">
                                Director
                            </h3>
                            <div className="text-gray-300">
                                {movie.director}
                            </div>
                        </div> */}
                        {/* <div>
                            <h3 className="text-white text-lg font-semibold mb-2">
                                Language
                            </h3>
                            <div className="text-gray-300">
                                {movie.language}
                            </div>
                        </div> */}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-12">
                    <h2 className="text-white text-2xl font-bold mb-6">
                        Reviews
                    </h2>

                    {/* Add Review Form - Only show if user hasn't reviewed */}
                    {!movie?.has_user_reviewed && (
                        <form onSubmit={handleSubmitReview} className="mb-8">
                            <div className="bg-[#181818] p-6 rounded-lg">
                                <div className="mb-4">
                                    <label className="block text-white mb-2 text-base font-semibold">
                                        How would you rate this movie?
                                    </label>
                                    <div className="flex flex-col items- gap-2 mb-2">
                                        <div className="flex items-center gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onMouseEnter={() =>
                                                        setHoverRating(star)
                                                    }
                                                    onMouseLeave={() =>
                                                        setHoverRating(0)
                                                    }
                                                    onClick={() =>
                                                        setRating(star)
                                                    }
                                                    className="relative group"
                                                >
                                                    <svg
                                                        className={`w-8 h-8 transition-all duration-200 ${
                                                            star <=
                                                            (hoverRating ||
                                                                rating)
                                                                ? "text-yellow-400"
                                                                : "text-gray-500"
                                                        }`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                </button>
                                            ))}
                                        </div>
                                        <div className="text-gray-400 text-sm">
                                            {hoverRating
                                                ? hoverRating === 1
                                                    ? "Poor"
                                                    : hoverRating === 2
                                                    ? "Fair"
                                                    : hoverRating === 3
                                                    ? "Good"
                                                    : hoverRating === 4
                                                    ? "Very Good"
                                                    : "Excellent"
                                                : rating
                                                ? `You've selected ${rating} star${
                                                      rating !== 1 ? "s" : ""
                                                  }`
                                                : "Click to rate"}
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4 flex gap-4">
                                    <textarea
                                        value={comment}
                                        onChange={(e) =>
                                            setComment(e.target.value)
                                        }
                                        className="w-1/2 bg-[#333] text-white p-4 h-16 rounded-md border border-gray-700 focus:outline-none focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914] transition-all duration-200 resize-none"
                                        rows={4}
                                        placeholder="Write your review here..."
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="bg-[#e50914] hover:bg-[#f6121d] text-white px-8 py-3 rounded-md font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                                    >
                                        <span>Submit Review</span>
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-[#181818] p-6 rounded-lg"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <StarRating
                                            rating={review.rating * 2}
                                        />
                                        <span className="text-gray-400">
                                            by {review.user}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-300">
                                    {review.comment}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieDetailPage;
