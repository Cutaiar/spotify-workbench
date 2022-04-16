import { Button } from "primereact/button";
import * as React from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { authEndpoint, clientId, scopes } from "../../common/authConfig";
import hash from "../../common/hash";
import { spotifyPrimaryGreen } from "../../common/style";

import { useAuth } from "../../context/authContext";
import { ISpotifyUser } from "../../context/spotifyUserContext";

export interface IConnectButtonProps {
  onConnect?: (user: ISpotifyUser) => void;
}

// TODO use window location instead
const regex = /#$/;
const redirectUri = window.location.href.replace(regex, ""); // TODO Fix not working from non home authorizations in local testing
const connectToSpotifyLink = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
  redirectUri
)}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;

export const ConnectButton: React.FC<IConnectButtonProps> = (props) => {
  const [auth, setToken] = useAuth();

  const { onConnect } = props;

  // TODO this relies on the the auth url being opened in the same window, causing the page
  // to reload, and this component to remount.
  React.useEffect(() => {
    // Get the access token from the url
    let _token: string = (hash as any).access_token;
    console.log("token from url:", _token);

    if (!_token) {
      // check if there already is a token stored, try to use it ...
      let prev_token = auth.tokens.spotify;
      console.log("Checking for existing token...");

      // If we find it, use it
      if (prev_token && prev_token !== "undefined") {
        console.log("found existing token:", prev_token);
        _token = prev_token;
      }
    }

    // If we found a token in the cache or url, we can log in with it
    if (_token) {
      const partialUser = {
        token: _token,
        spotifyApi: new SpotifyWebApi(),
      };
      partialUser.spotifyApi.setAccessToken(_token);

      // kickoff me request
      (async () => {
        try {
          const value = await partialUser.spotifyApi.getMe();
          const userWithUserObject = { ...partialUser, userObject: value };
          setToken("spotify", _token);
          onConnect?.(userWithUserObject);
          return;
        } catch (error) {
          console.error("Issue fetching user object from spotify api. ", error);
          return;
        }
      })();
    }
  }, []);

  return (
    <Button
      onClick={() => {
        window.location.href = connectToSpotifyLink;
      }}
      label={"Connect to spotify"}
      style={{
        display: "flex",
        flexFlow: "row-reverse",
        justifyContent: "center",
        alignItems: "center",
        background: spotifyPrimaryGreen,
      }}
      className={`p-ml-auto p-button-rounded`}
    >
      <div
        style={{
          paddingRight: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          alt=""
          src={"/Spotify_Icon_RGB_Black.png"}
          width={20}
          height={20}
        ></img>
      </div>
    </Button>
  );
};
