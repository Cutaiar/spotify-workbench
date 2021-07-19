import React, { useEffect, useState } from 'react';
import "primeflex/primeflex.css";
import { Images, fadeInImages } from "../GenerateWallpaper/GenerateWallpaper"
import { ISpotifyUser } from "../App/App";
import { getUsersLikedSongs } from "../../spotifyDataAccess"


interface HomeProps {
  spotifyUser: ISpotifyUser;
}

export const Home: React.FC<HomeProps> = (props: HomeProps) => {

  const [songs, setSongs] = useState([])

  useEffect(() => {


    (async () => {
      const songs = await getUsersLikedSongs(props?.spotifyUser?.token, 500)
      const imageList = songs.map(song => { return song.imageLink })
      setSongs(imageList)

    })()
    fadeInImages()


  }, [props.spotifyUser, songs]);

  return (

    <>
      <div style={{ height: "100%", overflow: "hidden" }}>
        <div style={{ position: "relative", textAlign: "center" }}>
          {songs.length && <Images listItems={songs} />}
        </div>
        <div>
          <p
            style={{
              textAlign: "left",
              paddingLeft: "50px",
              paddingTop: "20px",
              paddingRight: "50px",
              paddingBottom: "20px",
              color: "#4E565C",
              fontSize: 25,
              position: "absolute",
              backgroundColor: "#191919",
              borderRadius: "10px",
              opacity: 0.95,
              left: "30px",
              right: "30px",
              top: "103px",

            }}
          >
            Welcome to your Spotify workbench.
          <br />
            <br />
          This is a collection of tools, addons, and nifty functionality which
          aims to add both depth and simplicity to your modern music exploration
          and consumption.
          <br />
            <br />
            <a
              className={"p-text-light"}
              style={{ fontSize: 20, textDecoration: "none" }}
              href="https://github.com/Cutaiar/spotify-workbench"
              rel="noopener noreferrer"
              target="_blank"
            >
              https://github.com/Cutaiar/spotify-workbench
          </a>
          </p>

        </div>

      </div>
    </>);
};
