import React, { useState } from 'react';
import Chart from "chart.js";
import "primeflex/primeflex.css";
import { SelectButton } from 'primereact/selectbutton';
import { Button } from "primereact/button";
import { ISpotifyUser } from "../App/App";
import { getUsersLikedSongs } from "../../spotiverse-functions/getUsersLikedSongs";
import { Features, Song } from "../../spotiverse-functions";
import "./ChartPage.css";
import { withRouter } from 'react-router-dom';

interface IChartProps {
  spotifyUser: ISpotifyUser;
}

const defaultAttributes: (keyof Features)[] = [
  "danceability",
  "liveness",
  "energy",
  ];

const multiSelectOptions = [
  {name: "Danceability", value: "danceability"},
  {name: "Liveness", value: "liveness"},
  {name: "Energy", value: "energy"},
  {name: "Speechiness", value: "speechiness"},
  {name: "Valence", value: "valence"},
];

export const ChartPage: React.FC<IChartProps> = (props) => {
  const [songs, setSongs] = useState(null);
  const [index, setIndex] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState<(keyof Features)[]>(defaultAttributes);
  
  const getLikedSongs = async () => {
    const songs = await getUsersLikedSongs(props?.spotifyUser?.token);
    setSongs(songs);
  }

  const updateSeconds = () => setInterval(() => {
    console.log('Interval triggered');
    setIndex(index + 1);
  }, 1000);

  const ctx = document.getElementById('myChart') as HTMLCanvasElement;
  if (ctx) {
    const getAttribute = (song: Song, attribute: keyof typeof song.features) => {
      return song.features[attribute];
    }
  
    const testSong = songs[0];

    const testSong2 = songs[1];
  
    const chartData = selectedAttributes.map(attribute => (getAttribute(testSong, attribute)));

    const chartData2 = selectedAttributes.map(attribute => (getAttribute(testSong2, attribute)));
  
    let chart = ctx.getContext('2d');

    //graph options set here
    const options = {
      color: "white",
      scale: {
        angleLines: {
            display: false
        },
        ticks: {
          min: 0.0,
          max: 1.0
        }
      },
      labels: {
        fontSize: 18,
      }
    };

    Chart.defaults.global.defaultFontColor = 'white';
    Chart.defaults.global.defaultColor = 'green';
    
    new Chart(chart, {
      type: "radar",
      data: {
        //Bring in data
        labels: selectedAttributes,
        datasets: [
          {
            label: testSong.name,
            data: chartData,
          },
          {
            label: testSong2.name,
            data: chartData2,
          }
        ]
      },
      options: options,
    });
  }

  return (
    <div style={{ height: "100%" }}>
      <Button className={"p-button-info"} onClick={getLikedSongs}>Get Data</Button>
      <Button className={"p-button-info"} onClick={updateSeconds}>Start Count</Button>
      <SelectButton className="multiselect" value={selectedAttributes} options={multiSelectOptions} onChange={(e) => {
        console.log(e);
        setSelectedAttributes(e.value);
      }} optionLabel="name" multiple />
      <canvas id="myChart"/>
    </div>
  );
};