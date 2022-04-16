import { Features, randomFeatures } from "./features";
import { Artist, randomArtist } from "./artist";

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
  previewUrl: string | null;
  features: Features;
  artistInfo: Artist;
};

export const randomSong = (): Song => {
  return {
    name: "random song",
    addedAt: "",
    releaseDate: "",
    artist: "random artist",
    duration: 0,
    explicit: false,
    popularity: 0,
    imageLink: "",
    id: "",
    previewUrl: "",
    features: randomFeatures(),
    artistInfo: randomArtist(),
  };
};
