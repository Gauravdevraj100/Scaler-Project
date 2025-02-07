import { Movie } from "@/types/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://movie-stream-egha.onrender.com",
        prepareHeaders: async (headers) => {
            const session = await getSession();
            if (session && session.token) {
                headers.set("Authorization", `Token ${session.token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getMovies: builder.query<
            Movie[],
            { search?: string; genre?: string; year?: string }
        >({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params.search) queryParams.append("title", params.search);
                if (params.genre) queryParams.append("genre", params.genre);
                if (params.year)
                    queryParams.append("release_date", `${params.year}-01-01`);
                return `/movies/?${queryParams.toString()}`;
            },
        }),
        getMovieById: builder.query<Movie, string>({
            query: (id) => `/movies/${id}/`,
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: "/login/",
                method: "POST",
                body: credentials,
            }),
        }),
        register: builder.mutation({
            query: (userData) => ({
                url: "/signup/",
                method: "POST",
                body: userData,
            }),
        }),
        getGenres: builder.query<{ id: number; name: string }[], void>({
            query: () => "/genres/",
        }),
        getMovieReviews: builder.query<
            { id: number; rating: number; comment: string; user: string }[],
            string
        >({
            query: (movieId) => `/movies/${movieId}/reviews/`,
        }),
        addMovieReview: builder.mutation<
            void,
            { movieId: string; rating: number; comment: string }
        >({
            query: ({ movieId, ...review }) => ({
                url: `/movies/${movieId}/reviews/`,
                method: "POST",
                body: review,
            }),
        }),
    }),
});

export const {
    useGetMoviesQuery,
    useLoginMutation,
    useRegisterMutation,
    useGetMovieByIdQuery,
    useGetMovieReviewsQuery,
    useAddMovieReviewMutation,
    useGetGenresQuery,
} = api;
