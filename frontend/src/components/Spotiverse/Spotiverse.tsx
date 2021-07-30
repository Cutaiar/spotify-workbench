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
  const [isLoading, setLoading] = useState(true);


  // on mount (and when token changes), kickoff a request for the users liked songs
  // update state when they come down
  useEffect(() => {
    if (props.spotifyUser?.token)
      getLikedSongs()
  }, [props.spotifyUser?.token])

  const getLikedSongs = async () => {
    //this could be run as a web worker when we start up the app
    const songs = await getUsersLikedSongs(props?.spotifyUser?.token);
    setSongs(songs);
    setLoading(false)
  }

  const setSong = (song: Song) => {
    setSelectedSong(song)
  }

  return (
    <>
      {isLoading ? <div>Loading....</div> : (
        <div style={{ display: "flex", flexDirection: "row", height: "87vh" }}>
          <ThreeEngine songs={songs} setSong={setSong} song={selectedSong} />
          <div style={{ color: "white" }} className="songListWrapper">
            <SongList song={selectedSong} setSong={setSong} songs={songs} />
          </div>
        </div>
      )}
    </>
  );
};
