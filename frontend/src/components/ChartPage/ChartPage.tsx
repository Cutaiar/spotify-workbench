import React, { useState } from "react";
import Chart from "chart.js";
import "primeflex/primeflex.css";
import { SelectButton } from "primereact/selectbutton";
import { Button } from "primereact/button";
import { getUsersLikedSongs } from "../../spotifyDataAccess";
import { Features, Song } from "../../models";
import "./ChartPage.css";
import { useAuth } from "../../context/authContext";

interface IChartProps {}

const defaultAttributes: (keyof Features)[] = [
  "danceability",
  "liveness",
  "energy",
];

const multiSelectOptions = [
  { name: "Danceability", value: "danceability" },
  { name: "Liveness", value: "liveness" },
  { name: "Energy", value: "energy" },
  { name: "Speechiness", value: "speechiness" },
  { name: "Valence", value: "valence" },
  { name: "Instrumentalness", value: "instrumentalness" },
];

const NUM_SONGS = 5;

export const ChartPage: React.FC<IChartProps> = (props) => {
  const [songs, setSongs] = useState(null);
  const [index, setIndex] = useState(0);
  const [selectedAttributes, setSelectedAttributes] =
    useState<(keyof Features)[]>(defaultAttributes);

  const [auth, setToken] = useAuth();
  const spotifyToken = auth.tokens.spotify;

  const getLikedSongs = async () => {
    const songs = await getUsersLikedSongs(spotifyToken);
    setSongs(songs);
  };

  const updateSeconds = () =>
    setInterval(() => {
      console.log("Interval triggered");
      setIndex(index + 1);
    }, 1000);

  const ctx = document.getElementById("myChart") as HTMLCanvasElement;
  if (ctx) {
    const getAttribute = (
      song: Song,
      attribute: keyof typeof song.features
    ) => {
      return song.features[attribute];
    };

    let datasets = [];

    for (let i = 0; i < NUM_SONGS; i++) {
      const chartData = selectedAttributes.map((attribute) =>
        getAttribute(songs[i], attribute)
      );
      let dataset = {
        label: songs[i].name,
        data: chartData,
      };
      datasets.push(dataset);
    }

    let chart = ctx.getContext("2d");

    //graph options set here
    const options = {
      color: "white",
      scale: {
        angleLines: {
          display: false,
        },
        ticks: {
          min: 0.0,
          max: 1.0,
        },
      },
      labels: {
        fontSize: 18,
      },
    };

    Chart.defaults.global.defaultFontColor = "white";
    Chart.defaults.global.defaultColor = "green";

    new Chart(chart, {
      type: "radar",
      data: {
        //Bring in data
        labels: selectedAttributes,
        datasets: datasets,
      },
      options: options,
    });
  }

  return (
    <div style={{ height: "100%" }}>
      <Button className={"p-button-info"} onClick={getLikedSongs}>
        Get Data
      </Button>
      <Button className={"p-button-info"} onClick={updateSeconds}>
        Start Count
      </Button>
      <SelectButton
        className="multiselect"
        value={selectedAttributes}
        options={multiSelectOptions}
        onChange={(e) => {
          console.log(e);
          setSelectedAttributes(e.value);
        }}
        optionLabel="name"
        multiple
      />
      <canvas id="myChart" />
    </div>
  );
};
