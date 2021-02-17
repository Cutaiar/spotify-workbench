import React, { useContext, useEffect, useState } from "react";
import { AppStateContext } from "../../context/appStateContext";
import { Song } from "../../models/song";
import { getUsersLikedSongs } from "../../spotifyDataAccess";
import { ISpotifyUser } from "../App/App";
import { generateRandomSongsAsync } from "../../spotifyDataAccess/";
import { ThreeEngine } from "../ThreeEngine/ThreeEngine";

export interface ISpotiverseProps {
  spotifyUser?: ISpotifyUser;
}

export const Spotiverse: React.FC<ISpotiverseProps> = (props) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const appState = useContext(AppStateContext);

  // on mount (and when token changes), kickoff a request for the users liked songs
  // update state when they come down
  useEffect(() => {
    (async () => {
      const token = props.spotifyUser?.token;
      if (token) {
        // const fetchedSongs = await getUsersLikedSongs(token);
        const fetchedSongs = await generateRandomSongsAsync(100, 100);
        setSongs(fetchedSongs);
      }
    })();
  }, []);

  return (
    <div>
      <ThreeEngine songs={songs} />
    </div>
  );
};
