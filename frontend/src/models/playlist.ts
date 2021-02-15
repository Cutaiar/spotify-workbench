import { Song } from "./song";

export class Playlist {
  id: string;
  name: string;
  description: string;
  displayName: string;
  images: any;
  songs: Song[];
}
