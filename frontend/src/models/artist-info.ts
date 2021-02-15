export class ArtistInfo {
    followers: number;
    genres: Array<string>;
    main_artist: string;
    featured_artists: Array<string>;
    popularity: number;
    images: Array<Map<string, any>>;
    constructor(followers: number,
        genres: Array<string>,
        main_artist: string,
        featured_artists: Array<string>,
        popularity: number,
        images: Array<Map<string, any>>) {
            this.followers = followers;
            this.genres = genres;
            this.main_artist = main_artist;
            this.featured_artists = featured_artists;
            this.popularity = popularity;
            this.images = images;
    }
}
