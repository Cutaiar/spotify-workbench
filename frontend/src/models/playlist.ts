import { Song } from "./song";

export interface Playlist {
  id: string;
  name: string;
  description: string;
  displayName: string;
  images: any;
  songs: Song[];
}
