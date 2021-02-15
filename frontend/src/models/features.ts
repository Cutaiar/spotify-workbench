export class Features {
    tempo: number;
    valence: number;
    loudness: number;
    energy: number;
    key: number;
    mode: number;
    speechiness: number;
    acousticness: number;
    instrumentalness: number;
    liveness: number;
    danceability: number;
    popularity: number;

    constructor(tempo: number,
                valence: number,
                loudness: number,
                energy: number,
                key: number,
                mode: number,
                speechiness: number,
                acousticness: number,
                instrumentalness: number,
                liveness: number,
                danceability: number,
                popularity:number) {
        this.tempo = tempo
        this.valence = valence
        this.loudness = loudness
        this.energy = energy
        this.key = key
        this.mode = mode
        this.speechiness = speechiness
        this.acousticness = acousticness
        this.instrumentalness = instrumentalness
        this.liveness = liveness 
        this.danceability = danceability;
        this.popularity = popularity;
    }
}
