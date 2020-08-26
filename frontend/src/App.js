import React, { useEffect, useState } from "react";
import "./App.css";
import * as querystring from "query-string";
import SpotifyWebApi from "spotify-web-api-js";
import yoinkImage from "./yoink.jpg";
import cover_b64 from "./cover.js"
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";

const spotifyApi = new SpotifyWebApi();

function App() {



  ///NOTE I DONT THINK WE NEED ANY OF THE BELOW CODE IN TH BETWEEN THESE LINES
  //-----------------------------------------------------------------------------------------------


  // Set up state to hold token for l8r and a bool for showing the final wallpaper
  const [token, setToken] = useState("fake UNSET token");
  const [showWallpaper, setShowWallpaper] = useState(false);

  // Some url constants
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
  const authUrl = "https://accounts.spotify.com/authorize";

  const _onAuthClick = async (props) => {
    // Define the necessary q params as an object
    const queryParams = {
      client_id: "244e59e5133546b3ab9ccb2d7f5800b3",
      response_type: "code",
      redirect_uri: "albumcoverwallpaper://afterlogin",
    };

    // convert q params object into a string
    const queryParamsString = querystring.stringify(queryParams);
    //console.log(queryParamsString);

    // tac the q param string onto the base auth url and then add a cors proxy
    const urlWithParams = authUrl + `?${queryParamsString}`;
    const proxiedUrlWithParams = proxyUrl + urlWithParams;
    //console.log(proxiedUrlWithParams);

    // Use final ulr in a new window to attempt to get an auth toke from spotify. This is hard. There is an error rn
    window.open(proxiedUrlWithParams); // this will give: Missing required request header. Must specify one of: origin,x-requested-with

    // Commented code: idk maybe we make this call with fetch
    //   const response = fetch(proxiedUrlWithParams, {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     mode: "cors", // no-cors, *cors, same-origin
    //   })
    //     .then((resp) => {
    //       console.log("success" + resp);
    //       console.log(resp);
    //     })
    //     .catch((error) => {
    //       console.log("fail" + error);
    //     });
    // };

    // Set our state to have an auth token once we get one
    setToken("fake SET token");
    //spotifyApi.setToken("the token we just got");
  };

  const _onGenerateClick = (props) => {
    console.log("Generate Clicked");
    
    // Use spotifyApi to yoink all album objects
    
    // extract image links from resposnse
    
    // send image links in a separate object to our image-generation service
    
    // get back the finished image
    
    // update screen with downloadable/copyable image
    setShowWallpaper(true);
  };


  
//-----------------------------------------------------------------------------------------------
let token2 = hash.access_token;  
return (
    <div className="App">
      <h1>Album Cover Wallpaper Generator</h1>
      {/* <button className="Button" onClick={_onAuthClick}>
        Connect To Spotify
      </button> */}
      <a className="btn btn--loginApp-link"
        href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
          "%20"
        )}&response_type=token&show_dialog=true`}>
        Login to Spotify</a>
      <p>Token: {token2}</p>
      <button className="btn2 btn--loginApp-link" onClick={_onGenerateClick}>
        Generate Phone Wallpaper
      </button>
      <br></br><br></br>
      {showWallpaper && <img src={yoinkImage} height="100px" />}
      {showWallpaper && <img src={cover_b64} height="100px" />}
    </div>
  );
}

export default App;
