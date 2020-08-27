import React, { Component, useEffect, useState } from "react";
import "./App.css";
import * as querystring from "query-string";
import SpotifyWebApi from "spotify-web-api-js";
import yoinkImage from "./yoink.jpg";
import cover_b64 from "./cover.js"
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";
import mergeImages from 'merge-images';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

      token: null,
      listItems: [],
      showWallpaper: false
    };
    this.spotifyApi = new SpotifyWebApi();
  }

  componentDidMount() {
    // Set token
    let _token = hash.access_token;
    if (_token) {
      // Set token
      this.setState({
        token: _token
      });
      console.log(_token)
      this.spotifyApi.setAccessToken(_token);

    }
  }


  onGenerateClick = () => {
    const fetchData = async () => {
      let imageURIs = []

      const response = await this.spotifyApi.getMyTopTracks({ limit: 50, offset: 0 })
      response['items'].forEach(item => {
        imageURIs.push(item['album']['images'][0]['url'])
      })


      this.setState({
        listItems: imageURIs,
        showWallpaper: true
      });
    };
    fetchData();


  };

  render() {
    return (
      <div className="App">
        <h1>Album Cover Wallpaper Generator</h1>

        <a className="btn btn--loginApp-link"
          href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
            "%20"
          )}&response_type=token&show_dialog=true`}>
          Login to Spotify</a>
        <p>Token: {this.state.token}</p>
        <button className="btn2 btn--loginApp-link" onClick={this.onGenerateClick}>
          Generate Phone Wallpaper
      </button>
        <br></br><br></br>
        {this.state.showWallpaper &&
          this.state.listItems.map(function (item) {
            return <img src={item} height="100px" />
          })
        }
      </div>
    );
  }
}
export default App;
