import React, { useContext, useEffect, useState } from "react";
import { AppStateContext } from "../../context/appStateContext";
import { Song } from "../../models/song";
import { getUsersLikedSongs } from "../../spotifyDataAccess";
import { ISpotifyUser } from "../App/App";
import { generateRandomSongsAsync } from "../../spotifyDataAccess/";
import { ThreeEngine } from "../ThreeEngine/ThreeEngine";
import { SongList } from "../SongList/SongList"
import { TestData } from "./test-data"
import { Axis } from "../Axes/Axes"
import "./Spotiverse.css"

export interface ISpotiverseProps {
  spotifyUser?: ISpotifyUser;
}

interface Axes {
  //these should be a type of all the options we have for graphing
  // i.e. valence, loudness, tempo, etc...
  X: any;
  Y: any;
  Z: any;

}


export const Spotiverse: React.FC<ISpotiverseProps> = (props) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const appState = useContext(AppStateContext);
  const [selectedSong, setSelectedSong] = useState<Song>(null);
  const [isLoading, setLoading] = useState(true);

  const [axisChange, setAxisChange] = useState(null) //this will be a boolean flip that we will listen too in three engine.tsx, every time it changes we should update particles locations


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

  const renderAxis = () => {
    return (
      <>
        <Axis marginTop={0} axisChange={axisChange} setAxisChange={setAxisChange} axis="X" />
        <Axis marginTop={100} axisChange={axisChange} setAxisChange={setAxisChange} axis="Y" />
        <Axis marginTop={200} axisChange={axisChange} setAxisChange={setAxisChange} axis="Z" />
      </>
    )
  }

  return (
    <>
      {isLoading ? <div>Loading....</div> : (
        <div style={{ display: "flex", flexDirection: "row", height: "87vh" }}>
          {renderAxis()}
          <ThreeEngine axisChange={axisChange} songs={songs} setSong={setSong} song={selectedSong} />
          <div style={{ color: "white" }} className="songListWrapper">
            <SongList song={selectedSong} setSong={setSong} songs={songs} />
          </div>
        </div>
      )}
    </>
  );
};
