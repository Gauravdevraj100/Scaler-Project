export interface Movie {
    id: number;
    title: string;
    description: string;
    cover_image: string;
    release_date: string;
    duration: number;
    genres: {
        id: number;
        name: string;
    }[];
    star_cast: string;
    video: string;
    category: number;
    average_rating: number;
    has_user_reviewed: boolean;
}

