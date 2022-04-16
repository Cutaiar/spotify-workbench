// Sorry too much to fix
// @ts-nocheck

import React, { useEffect, useState } from "react";

import { Song } from "../../models/song";
import { getUsersLikedSongs } from "../../spotifyDataAccess";

import { ThreeEngine } from "../ThreeEngine/ThreeEngine";
import { SongList } from "../SongList/SongList";

import { Axis } from "../Axes/Axes";
import "./Spotiverse.css";
import { useAuth } from "../../context/authContext";

export interface ISpotiverseProps {}

export const Spotiverse: React.FC<ISpotiverseProps> = (props) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song>();
  const [isLoading, setLoading] = useState(true);

  const [axisChange, setAxisChange] = useState(undefined); //this will be a boolean flip that we will listen too in three engine.tsx, every time it changes we should update particles locations

  const [auth, setToken] = useAuth();
  const spotifyToken = auth.tokens.spotify;

  // on mount (and when token changes), kickoff a request for the users liked songs
  // update state when they come down
  useEffect(() => {
    if (spotifyToken) {
      const getLikedSongs = async () => {
        //this could be run as a web worker when we start up the app
        const songs = await getUsersLikedSongs(spotifyToken);
        setSongs(songs);
        setLoading(false);
      };
    }
  }, [spotifyToken]);

  const setSong = (song: Song) => {
    setSelectedSong(song);
  };

  const renderAxis = () => {
    return (
      <div className="AxesWrapper">
        <Axis
          axisChange={axisChange}
          color="#0b933b"
          setAxisChange={setAxisChange}
          axis="X"
          defaultValue="speechiness"
        />
        <Axis
          axisChange={axisChange}
          color="#229d9d"
          setAxisChange={setAxisChange}
          axis="Y"
          defaultValue="acousticness"
        />
        <Axis
          axisChange={axisChange}
          color="#c7e7a1"
          setAxisChange={setAxisChange}
          axis="Z"
          defaultValue="valence"
        />
      </div>
    );
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row", height: "92vh" }}>
        {renderAxis()}
        <ThreeEngine
          axisChange={axisChange}
          songs={songs}
          setSong={setSong}
          song={selectedSong}
        />
        <div style={{ color: "white" }} className="songListWrapper">
          <SongList song={selectedSong} setSong={setSong} songs={songs} />
        </div>
      </div>
    </>
  );
};
