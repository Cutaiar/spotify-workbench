type TrackImage = {
    height: number;
    url: string;
    width: number;
}

export type Artist = {
    followers: number;
    genres: string[];
    mainArtist: string;
    featuredArtists: string[];
    popularity: number;
    images: TrackImage[];

}
export type Features = {
    danceability: number;
    energy: number;
    key: number;
    loudness: number;
    mode: number;
    speechiness: number;
    acousticness: number;
    instrumentalness: number
    liveness: number;
    valence: number;
    tempo: number;
    timeSignature: number;
}

export type Song = {
    name: string;
    addedAt: string;
    releaseDate: string;
    artist: string;
    duration: number;
    explicit: boolean;
    popularity: number;
    imageLink: string;
    id: string;
    previewUrl: string;
    features: Features;
    artistInfo: Artist;
}