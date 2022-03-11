import { Button } from "primereact/button";
import * as React from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { authEndpoint, clientId, scopes } from "../../common/authConfig";
import hash from "../../common/hash";
import { spotifyPrimaryGreen } from "../../common/style";

import { useAuth } from "../../context/authContext";

export interface ISpotifyUser {
  userObject?: SpotifyApi.CurrentUsersProfileResponse;
  token: string;
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
}
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
    let _token: string = (hash as any).access_token;
    console.log("token:", _token);
    if (!_token) {
      // check if there already is a token stored, try to use it ...
      let prev_token = window.localStorage.getItem("user_token");
      console.log("prev:", prev_token);

      if (prev_token && prev_token !== "undefined") {
        _token = prev_token;
      }
    }
    if (_token) {
      const user: ISpotifyUser = {
        userObject: undefined,
        token: _token,
        spotifyApi: new SpotifyWebApi(),
      };
      user.spotifyApi.setAccessToken(_token);

      // kickoff me request
      (async () => {
        try {
          const value = await user.spotifyApi.getMe();
          const userWithUserObject = { ...user, userObject: value };
          setToken("spotify", _token);
          onConnect(userWithUserObject);
          window.localStorage.setItem("user_token", _token); //set local storage to remember token thru refresh
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
