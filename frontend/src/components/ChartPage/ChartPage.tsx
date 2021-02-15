import React from "react";
import Chart from "chart.js";
import "primeflex/primeflex.css";
import { Button } from "primereact/button";
import { ISpotifyUser } from "../App/App";
import { getUsersLikedSongs } from "../../spotiverse-functions/getUsersLikedSongs";
import { Features, Song } from "../../spotiverse-functions";
import { SongListItem } from "../RunPlaylist/SongListItem";

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
  }

  const ctx = document.getElementById('myChart') as HTMLCanvasElement;
  if (ctx) {
    const getAttribute = (song: Song, attribute: keyof typeof song.features) => {
      return song.features[attribute];
    }
  
    const testSong = state.songs[1];
    const attributes: (keyof Features)[] = ["danceability", "liveness", "energy"];
  
    const chartData = attributes.map(attribute => (getAttribute(testSong, attribute)));
  
    let chart = ctx.getContext('2d');

    //graph options set here
    const options = {
      scale: {
        angleLines: {
            display: false
        },
        ticks: {
          min: 0.0,
          max: 1.0
        }
      }
    };
    
    new Chart(chart, {
      type: "radar",
      data: {
        //Bring in data
        labels: attributes,
        datasets: [
          {
            label: testSong.name,
            data: chartData,
          }
        ]
      },
      options: options,
    });
  }

  return (
    <div style={{ height: "100%" }}>
      <Button className={"p-button-info"} onClick={getLikedSongs}>Get Data</Button>
      <canvas id="myChart"/>
    </div>
  );
};