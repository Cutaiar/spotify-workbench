import React from "react";
import "primeflex/primeflex.css";

export const Home: React.FC = (props) => {
  return (
    <div
      className={"p-d-flex p-jc-center p-flex-column p-ai-center"}
      style={{ height: "100%" }}
    >
      <div style={{ width: 300, color: "white" }}>
        <h3 style={{ color: "white" }}>Welcome to Spotify Workbench</h3>
        <p>
          Welcome to your Spotify workbench. This is a collection of tools,
          addons, and nifty functionality which aims to add both depth and
          simplicity to your modern music exploration and consumption. Right
          now, you can create a wallpaper and make a playlist out of your
          recently listened songs. Connect to Spotify (top right) to get
          started!
        </p>
      </div>
    </div>
  );
};
