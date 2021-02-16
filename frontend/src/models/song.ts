import { Features, randomFeatures } from "./features";
import { Artist, randomArtist } from "./artist";

export type Song = {
  name: string;
  addedAt: Date;
  releaseDate: Date;
  artist: string;
  duration: number;
  explicit: boolean;
  popularity: number;
  imageLink: string;
  id: number;
  previewUrl: string;
  features: Features;
  artistInfo: Artist;
};

export const randomSong = (): Song => {
  return {
    name: "random song",
    addedAt: new Date(),
    releaseDate: new Date(),
    artist: "random artist",
    duration: 0,
    explicit: false,
    popularity: 0,
    imageLink: "",
    id: 0,
    previewUrl: "",
    features: randomFeatures(),
    artistInfo: randomArtist(),
  };
};
