import React from "react";
import Chart from "chart.js";
import "primeflex/primeflex.css";
import { ISpotifyUser } from "../App/App";
import { getUsersLikedSongs } from "../../spotiverse-functions/getUsersLikedSongs";
import { Song } from "../../spotiverse-functions";

interface IChartProps {
  spotifyUser: ISpotifyUser;
}

interface IChartState {
  songs: Song[];
  showList: boolean;
}

export const ChartPage: React.FC<IChartProps> = (props) => {
  const initialState: IChartState = {
    songs: [],
    showList: false,
  };
  const [state, setState] = React.useState<IChartState>(
      initialState
  );
  const getLikedSongs = async () => {
    const songs = await getUsersLikedSongs(props?.spotifyUser?.token);
    setState({
        songs: songs,
        showList: false,
    })
    console.log(songs);
  }

  let ctx = document.getElementById('myChart') as HTMLCanvasElement;
  if (ctx) {
    let chart = ctx.getContext('2d');
    
    new Chart(chart, {
      type: "line",
      data: {
        //Bring in data
        labels: ["Jan", "Feb", "March"],
        datasets: [
          {
            label: "Sales",
            data: [86, 67, 91],
          }
        ]
      },
      options: {
        //Customize chart options
      }
    });
  }

  return (
    <div style={{ height: "100%" }}>
      <p style={{ color: "white" }}>{state.songs[0]?.name}{state.showList}asf</p>
      <button onClick={getLikedSongs}/>
      <canvas id="myChart"/>
    </div>
  );
};