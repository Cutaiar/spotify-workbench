import React, { useContext, useEffect, useState } from "react";
import { AppStateContext } from "../../context/appStateContext";
import { Song } from "../../models/song";
import { getUsersLikedSongs } from "../../spotifyDataAccess";
import { ISpotifyUser } from "../App/App";
import { generateRandomSongsAsync } from "../../spotifyDataAccess/";
import { ThreeEngine } from "../ThreeEngine/ThreeEngine";
import { SongList } from "../SongList/SongList"
import { TestData } from "./test-data"
import "./Spotiverse.css"

export interface ISpotiverseProps {
  spotifyUser?: ISpotifyUser;
}


export const Spotiverse: React.FC<ISpotiverseProps> = (props) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const appState = useContext(AppStateContext);
  const [selectedSong, setSelectedSong] = useState<Song>(null);

  // on mount (and when token changes), kickoff a request for the users liked songs
  // update state when they come down
  useEffect(() => {
    (async () => {
      const token = props.spotifyUser?.token;
      if (token) {
        // const fetchedSongs = await getUsersLikedSongs(token);
        const fetchedSongs = await generateRandomSongsAsync(100, 100); //can we use TestData for now?
        setSongs(fetchedSongs);
      }
    })();
  }, []);

  const setSong = (song: Song) => {
    setSelectedSong(song)
  }

  return (
    <>
        {selectedSong?.name}
      <div style={{ display: "flex", flexDirection: "row", height: "87vh" }}>
        <ThreeEngine songs={TestData} setSong={setSong} song={selectedSong} />
        <div style={{ color: "white" }} className="songListWrapper">
          <SongList song={selectedSong} setSong={setSong} songs={TestData} />
        </div>
      </div>
    </>
  );
};
