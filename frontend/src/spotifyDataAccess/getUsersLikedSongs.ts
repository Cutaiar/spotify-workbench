import axios from "axios";
import { Artist } from "../models/artist";
import { Features } from "../models/features";
import { Song } from "../models/song";

const libraryUrl = "https://api.spotify.com/v1/me/tracks";
const idUrl = "https://api.spotify.com/v1/audio-features?ids=";
const artistUrl = "https://api.spotify.com/v1/artists?ids=";

export const getUsersLikedSongs = async (
  token: string,
  count = 50
): Promise<Song[]> => {
  const header = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };
  let json = [];
  var off = 0;
  while (off < count) {
    let response = await axios.get(libraryUrl, {
      headers: header,
      params: { offset: off, limit: 50 },
    });
    let tracks = response.data.items;
    let idStr = "";
    tracks.forEach(function (entry: any) {
      idStr += entry.track.id + ",";
    });
    idStr = idStr.slice(0, -1);
    let artistStr = "";
    tracks.forEach(function (entry: any) {
      artistStr += entry.track.artists[0].id + ",";
    });
    artistStr = artistStr.slice(0, -1);
    response = await axios.get(idUrl + idStr, {
      headers: header,
      params: idStr,
    });
    let features = response.data.audio_features;
    response = await axios.get(artistUrl + artistStr, {
      headers: header,
      params: artistStr,
    });
    let artists = response.data.artists;
    for (let i = 0; i < 50; i++) {
      if (features[i]) {
        let artistArr: any = [];
        tracks[i].track.artists.forEach(function (entry: any) {
          artistArr.push(entry.name);
        });
        const currArtist: Artist = {
          followers: artists[i].followers.total,
          genres: artists[i].genres,
          mainArtist: artists[i].name,
          featuredArtists: artistArr,
          popularity: artists[i].popularity,
          images: artists[i].images,
        };

        const currFeatures: Features = {
          danceability: features[i].danceability,
          energy: features[i].energy,
          key: features[i].key,
          loudness: features[i].loudness,
          mode: features[i].mode,
          speechiness: features[i].speechiness,
          acousticness: features[i].acousticness,
          instrumentalness: features[i].instrumentalness,
          liveness: features[i].liveness,
          valence: features[i].valence,
          tempo: features[i].tempo,
          timeSignature: features[i].time_signature,
        };

        const track = tracks[i];

        const currSong: Song = {
          name: track.track.name,
          addedAt: track.added_at,
          releaseDate: track.track.album.release_date,
          artist: track.track.artists[0].name,
          duration: track.track.duration_ms,
          explicit: track.track.explicit,
          popularity: track.track.popularity,
          imageLink: track.track.album.images[0].url,
          id: track.track.id,
          previewUrl: track.track.preview_url,
          features: currFeatures,
          artistInfo: currArtist,
        };
        json.push(currSong);
      }
    }
    off += 50;
  }
  return json;
};
