import React, { useEffect, useState } from "react";
import "primeflex/primeflex.css";
import { Images, fadeInImages } from "../GenerateWallpaper/GenerateWallpaper";
import {
  getUsersLikedSongs,
  generateBillboardSongs,
} from "../../spotifyDataAccess";
import * as style from "./Home.style";
import { useAuth } from "../../context/authContext";

interface HomeProps {}

export const Home: React.FC<HomeProps> = (props: HomeProps) => {
  const [songs, setSongs] = useState(generateBillboardSongs());

  const [auth, setToken] = useAuth();
  const spotifyToken = auth.tokens.spotify;

  useEffect(() => {
    if (spotifyToken) {
      (async () => {
        const songs = await getUsersLikedSongs(spotifyToken, 500);
        const imageList = songs.map((song) => {
          return song.imageLink;
        });
        setSongs(imageList);
      })();
      fadeInImages();
    }
  }, [spotifyToken, songs]);

  return (
    <>
      <div style={{ height: "100%", overflow: "hidden" }}>
        <div
          style={{
            position: "relative",
            textAlign: "center",
          }}
        >
          {songs.length && <Images listItems={songs} />}
        </div>
        <div className={"fadeIn"} style={{ position: "absolute", top: 50 }}>
          <p
            style={{
              ...style.titleBox,
              ...{
                textAlign: "left",
                paddingLeft: "50px",
                paddingTop: "50px",
                paddingRight: "50px",
                paddingBottom: "50px",
                fontSize: 32,
                borderRadius: "10px",
                opacity: 0.95,
              },
            }}
          >
            Welcome to your Spotify Workbench.
            <p style={{ fontSize: 20 }}>
              This is a collection of tools, addons, and nifty functionality
              which aims to add both depth and simplicity to your modern music
              exploration and consumption.
            </p>
            <br />
            <a
              className={"p-text-light"}
              style={{
                fontSize: 14,
                textDecoration: "none",
                color: "grey",
              }}
              href="https://github.com/Cutaiar/spotify-workbench"
              rel="noopener noreferrer"
              target="_blank"
            >
              https://github.com/Cutaiar/spotify-workbench
            </a>
          </p>
        </div>
      </div>
    </>
  );
};
