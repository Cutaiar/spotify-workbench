import React from "react";
import _ from "lodash";

import { cleanUpAuthToken, getAccessAndRefreshTokens } from "./utils";
import { useHistory, useLocation } from "react-router";
import { useAuth } from "../../context/authContext";

export interface IStravaRedirectProps {
  /** The name of the page (without "/") to redirect to after the exchange is done */
  redirectPageName: string;
}
/**
 * This is a simple FC which expects to be rendered when a strava auth flow redirects to redirect_uri (usually using React Router).
 *
 * When it mounts, it will try to get the auth token from the url, exchange it for an access token adds it to the auth context, and redirects to the another page.
 *
 * The render from the component is not usually visible as the token exchange usually happens quickly.
 *
 * Based on [this article](https://levelup.gitconnected.com/add-strava-oauth2-login-to-your-react-app-in-15-minutes-6c92e845919e).
 */
export const StravaRedirect: React.FC<IStravaRedirectProps> = (props) => {
  const [authState, setToken] = useAuth();
  const history = useHistory();
  const location = useLocation();

  React.useEffect(
    () => {
      const authenticate = async () => {
        const { redirectPageName } = props;
        try {
          // If not redirected to Strava, return to home
          if (_.isEmpty(location)) {
            return history.push("/");
          }

          // Save the Auth Token to the Store (it's located under 'search' for some reason)
          const stravaAuthToken = cleanUpAuthToken(location.search);

          // Post Request to Strava (with AuthToken) which returns Refresh Token and and Access Token
          const response = await getAccessAndRefreshTokens(stravaAuthToken);
          const responseJson = await response?.json();
          const accessToken = responseJson.access_token;

          // TODO exchange gives us more than just an access token.
          // It gives
          // {
          //     "token_type": "Bearer",
          //     "expires_at": 1568775134,
          //     "expires_in": 21600,
          //     "refresh_token": "e5n567567...",
          //     "access_token": "a4b945687g...",
          //     "athlete": {
          //       #{summary athlete representation}
          //     }
          //   }
          // So maybe we should store this...
          if (accessToken) {
            setToken("strava", accessToken);
          } else {
            console.log("Could not set access token...");
          }

          // Axios request to get users info
          // const user = await getUserData(userID, accessToken);
          // this.props.setUserActivities(user);

          // Once complete, go to display page
          history.push(`/${redirectPageName}`);
        } catch (error) {
          history.push("/");
        }
      };
      authenticate();
    },
    [
      /** Intentionally left blank to run once on mount */
    ]
  );

  return <div>GETTING ACCESS TOKEN...</div>;
};
