import React from "react";
import "./GenerateWallpaper.css";
import axios from "axios";
import { Button } from "primereact/button";
import { ISpotifyUser } from "../App/App";

interface IGenerateWallpaperProps {
  spotifyUser: ISpotifyUser;
}

interface IGenerateWallpaperState {
  listItems: any[];
  showWallpaper: boolean;
  wallpaperResponse: string;
}
const GenerateWallpaper: React.FC<IGenerateWallpaperProps> = (props) => {
  const initialState: IGenerateWallpaperState = {
    listItems: [],
    showWallpaper: false,
    wallpaperResponse: undefined,
  };
  const [state, setState] = React.useState<IGenerateWallpaperState>(
    initialState
  );

  const onGenerateClick = () => {
    let promises = [];
    let responseLength = 0;
    let imageURIs: any[] = [];

    for (let i = responseLength; i < 10; i++) {
      promises.push(
        axios.get("https://api.spotify.com/v1/me/tracks", {
          headers: { Authorization: "Bearer " + props.spotifyUser?.token },
          params: {
            offset: i * 50,
            limit: 50,
          },
        })
      );
    }
    axios
      .all(promises)
      .then(
        axios.spread((...responses) => {
          responses.forEach((response) => {
            console.log(response);
            response["data"]["items"].forEach((item: any) => {
              if (item["track"]["album"]["images"][2]) {
                imageURIs.push(item["track"]["album"]["images"][2]["url"]);
              }
            });
          });
          setState({
            listItems: imageURIs,
            showWallpaper: true,
            wallpaperResponse: undefined,
          });
        })
      )
      .catch((errors) => {
        console.error(errors);
      });
  };

  const onUploadClicked = async () => {
    // Get the URIs from state
    const URIs = state.listItems;

    // Hit the wp-service with the list of URIs
    console.log("Sending URIs to server");
    const resp = await fetch("http://localhost:3001/", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(URIs), // TODO [cutaiar] state.listItems may not have all the items we want depending on when you call this method since it only updates between renders
    });

    // Save the wallpaper from the response in state
    const wallpaper = await resp.text();
    console.log("Got Wallpaper");
    setState({ ...state, wallpaperResponse: wallpaper });
  };

  return (
    <div className="GenerateWallpaperRoot">
      <h1>Album Cover Wallpaper Generator</h1>

      <Button
        className="p-button-primary"
        onClick={onGenerateClick}
        disabled={!props.spotifyUser?.token}
        icon="pi pi-images"
        label="Get Images from Spotify"
      ></Button>
      <Button
        className="p-button-primary"
        onClick={onUploadClicked}
        disabled={!state.showWallpaper}
        icon="pi pi-play"
        label="Generate Wallpaper (backend)"
      ></Button>

      {state.wallpaperResponse && (
        <>
          <p>Wallpaper from backend: click to download</p>
          <a href={state.wallpaperResponse} download>
            <img alt="" src={state.wallpaperResponse} height="500"></img>
          </a>
        </>
      )}

      {state.showWallpaper && (
        <>
          <p>Images from Spotify:</p>
          {state.listItems.map((item, i) => {
            return <img alt="" src={item} height="50px" key={i} />;
          })}
        </>
      )}
    </div>
  );
};

export { GenerateWallpaper };
