import { Features } from "./features"
import { ArtistInfo } from "./artist-info"

export class Song {
    name: string;
    added_at: string;
    release_date: string;
    artist: string;
    duration: number;
    explicit: boolean;
    popularity: number;
    id: string;
    image_link: string;
    song_info: object;
    song_popularity: number;
    features: Features;
    artist_info: ArtistInfo;
    preview_url: string;

    constructor(
        inName: string,
        inAdded: string,
        inRelease_date: string,
        inArtist: string,
        inDuration: number,
        inExplicit: boolean,
        inPopularity: number,
        inId: string,
        inImageLink: string,
        inSongPopularity: number,
        inFeatures: Features,
        inArtistInfo: ArtistInfo,
        previewURL: string) {
        this.name = inName;
        this.added_at = inAdded;
        this.release_date = inRelease_date;
        this.artist = inArtist;
        this.duration = inDuration;
        this.explicit = inExplicit;
        this.popularity = inPopularity;
        this.id = inId;
        this.image_link = inImageLink
        this.song_popularity = inSongPopularity;
        this.features = inFeatures;
        this.artist_info = inArtistInfo;
        this.preview_url = previewURL;
    }

    addInfo(inInfo: object) {
        this.song_info = inInfo;
    }

    public static Random() {
        return new Song("random song", "", "", "", 0, false, 0, "", "", 0,
               new Features(Math.random(), Math.random(), Math.random(),
                            Math.random(), Math.random(), Math.random(),
                            Math.random(), Math.random(), Math.random(),
                            Math.random(), Math.random(), Math.random()), null, null);
    }
}
