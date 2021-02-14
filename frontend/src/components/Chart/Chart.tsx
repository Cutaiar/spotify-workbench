import React from "react";
import "primeflex/primeflex.css";
import { ISpotifyUser } from "../App/App";

interface IChartProps {
  spotifyUser: ISpotifyUser;
}

export const Chart: React.FC<IChartProps> = (props) => {
  return (
    <div style={{ height: "100%" }}>
      <p style={{ color: "white" }}>pee</p>
    </div>
  );
};