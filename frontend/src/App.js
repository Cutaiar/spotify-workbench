import React, { Component, useEffect, useState } from "react";
import "./App.css";
import SpotifyWebApi from "spotify-web-api-js";

import cover_b64 from "./cover.js";
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";

import axios from "axios";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      listItems: [],
      showWallpaper: false,
      wallpaperResponse: "",
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
        wallpaperResponse: "no reponse yet",
      });
      this.spotifyApi.setAccessToken(_token);
    }
  }

  onGenerateClick = () => {
    let promises = [];
    let responseLength = 0;
    let imageURIs = [];

    for (let i = responseLength; i < 4; i++) {
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
              imageURIs.push(item["track"]["album"]["images"][0]["url"]);
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
      <div className="App">
        <h1>Album Cover Wallpaper Generator</h1>

        <a
          className="btn btn--loginApp-link"
          href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
            "%20"
          )}&response_type=token&show_dialog=true`}
        >
          Login to Spotify
        </a>
        <p>Token: {this.state.token}</p>
        <button
          className="btn2 btn--loginApp-link"
          onClick={this.onGenerateClick}
        >
          Generate Phone Wallpaper
        </button>
        <button
          className="btn3 btn--loginApp-link"
          onClick={this.onUploadClicked}
        >
          Upload to wp-service
        </button>
        <br></br>
        <br></br>
        <p>Wallpaper (one image):</p>
        <img src={this.state.wallpaperResponse} height="1000"></img>
        <br></br>
        <p>Images from Spotify:</p>
        <br></br>
        {this.state.showWallpaper &&
          this.state.listItems.map(function (item) {
            return <img src={item} height="50px" />;
          })}
      </div>
    );
  }
}
export default App;
