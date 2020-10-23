import SpotifyWebApi from "spotify-web-api-js";

/**
 * Get a list of image uris for the given list of songs (in the same order?)
 *
 * Note: spotify-web-api-js doesn't have the images for single tracks for some reason. Just use this.
 * @param spotifyApi The spotifyApi to use (usually from your props)
 * @param ids A CSV list of song ids to get the images for
 */
const getImageForSpotifyTracks = async (
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs,
  ids: string[]
) => {
  const manualResponse = (await spotifyApi.getGeneric(
    `https://api.spotify.com/v1/me/tracks?ids=${ids.join(",")}`
  )) as any;
  const songImageUris = manualResponse["items"].map((item: any) => {
    return item["track"]["album"]["images"][2]["url"];
  });
  return songImageUris as string[];
};

export { getImageForSpotifyTracks };
