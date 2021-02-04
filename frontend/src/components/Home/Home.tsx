import React from "react";
import "primeflex/primeflex.css";

export const Home: React.FC = (props) => {
  return (
    <div style={{ height: "100%" }}>
      <div style={{ width: 1000 }}>
        <p
          style={{
            paddingLeft: "50px",
            paddingTop: "50px",
            color: "#4E565C",
            fontSize: 25,
          }}
        >
          Welcome to your Spotify workbench.
          <br />
          <br />
          This is a collection of tools, addons, and nifty functionality which
          aims to add both depth and simplicity to your modern music exploration
          and consumption.
        </p>
      </div>
    </div>
  );
};
