import React, { Component, useEffect, useState } from "react";
import "./GenerateWallpaper.css";
import SpotifyWebApi from "spotify-web-api-js";
import {
  authEndpoint,
  clientId,
  redirectUri,
  scopes,
} from "../../common/config";
import hash from "../../common/hash";
import axios from "axios";
import { Button } from "primereact/button";

const connectToSpotifyLink = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
  "%20"
)}&response_type=token&show_dialog=true`;

class GenerateWallpaper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: undefined,
      listItems: [],
      showWallpaper: false,
      wallpaperResponse: undefined,
    };
    this.spotifyApi = new SpotifyWebApi();
  }

  componentDidMount() {
    // Set token
    let _token = hash.access_token;
    if (_token) {
      // Set token
      this.setState({
        token: _token,
      });
      this.spotifyApi.setAccessToken(_token);
    }
  }

  onGenerateClick = () => {
    let promises = [];
    let responseLength = 0;
    let imageURIs = [];

    for (let i = responseLength; i < 10; i++) {
      promises.push(
        axios.get("https://api.spotify.com/v1/me/tracks", {
          headers: { Authorization: "Bearer " + this.state.token },
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
            response["data"]["items"].forEach((item) => {
              if (item["track"]["album"]["images"][2]) {
                imageURIs.push(item["track"]["album"]["images"][2]["url"]);
              }
            });
          });
          this.setState({
            listItems: imageURIs,
            showWallpaper: true,
          });
        })
      )
      .catch((errors) => {
        console.error(errors);
      });
  };

  onUploadClicked = async () => {
    // Get the URIs from state
    const URIs = this.state.listItems;

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
    this.setState({ wallpaperResponse: wallpaper });
  };

  render() {
    return (
      <div className="GenerateWallpaperRoot">
        <h1>Album Cover Wallpaper Generator</h1>

        <Button
          onClick={() => {
            window.location.href = connectToSpotifyLink;
          }}
          icon={this.state.token ? "pi pi-check" : "pi pi-sign-in"}
          label={this.state.token ? "Token acquired" : "Connect To Spotify"}
          className={`p-button-${this.state.token ? "success" : "info"}`}
        ></Button>
        <Button
          className="p-button-primary"
          onClick={this.onGenerateClick}
          disabled={!this.state.token}
          icon="pi pi-images"
          label="Get Images from Spotify"
        ></Button>
        <Button
          className="p-button-primary"
          onClick={this.onUploadClicked}
          disabled={!this.state.showWallpaper}
          icon="pi pi-play"
          label="Generate Wallpaper (backend)"
        ></Button>

        {this.state.wallpaperResponse && (
          <>
            <p>Wallpaper from backend: click to download</p>
            <a href={this.state.wallpaperResponse} download>
              <img src={this.state.wallpaperResponse} height="500"></img>
            </a>
          </>
        )}

        {this.state.showWallpaper && (
          <>
            <p>Images from Spotify:</p>
            {this.state.listItems.map((item, i) => {
              return <img src={item} height="50px" key={i} />;
            })}
          </>
        )}
      </div>
    );
  }
}
export { GenerateWallpaper };
