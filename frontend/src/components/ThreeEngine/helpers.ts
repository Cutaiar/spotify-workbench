import { Song } from "../../models/song";

export const generateTestLocalSongs = (numSongs = 300) => {
  let data = new Array<Song>();
  for (let i = 0; i < numSongs; i++) {
    data.push(Song.Random());
  }
  return data;
};
