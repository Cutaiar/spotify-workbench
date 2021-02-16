import { randomSong, Song } from "../models/song";

/**
 * Generate numSongs songs with random data inside
 * @param numSongs the number of songs to generate (300 if undefined)
 */
export const generateRandomSongs = (numSongs = 300): Song[] => {
  let data = new Array<Song>();
  for (let i = 0; i < numSongs; i++) {
    data.push(randomSong());
  }
  return data;
};

/**
 * Generate numSongs songs with random data inside asynchronously
 *
 * Note: useful for simulating data from network request
 *
 * @param numSongs the number of songs to generate (300 if undefined)
 * @param delay how long to wait before returning the songs in ms
 */
export const generateRandomSongsAsync = async (
  numSongs = 300,
  delay = 2000
): Promise<Song[]> => {
  let data = new Array<Song>();
  for (let i = 0; i < numSongs; i++) {
    data.push(randomSong());
  }
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
};
