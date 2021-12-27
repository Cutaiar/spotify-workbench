import { Button, Grid, Stack } from "grommet";
import * as React from "react";
import { AthleteResponse, default as strava, Strava } from "strava-v3";
import { useAuth } from "../../context/authContext";

const config = {
  access_token: "e92d70f61ad470109a12ee13eeb7e09b6f3a88c3",
  client_id: "54845",
  client_secret: "65c0799dba5feb377f105d3ba511738ac24adf7d",
  redirect_uri: "http://localhost:3000/redirect",
};

export const StravaPage: React.FC = () => {
  const [athlete, setAthlete] = React.useState<AthleteResponse>();
  const [error, setError] = React.useState(false);
  const fetchAthelete = React.useCallback(async () => {
    // Todo: get auth token from redirect flow https://levelup.gitconnected.com/add-strava-oauth2-login-to-your-react-app-in-15-minutes-6c92e845919e
    strava.config(config);
    try {
      const payload = await strava.athlete.get({});
      console.log(payload);
      setAthlete(payload);
      setError(false);
    } catch (error) {
      console.log(error);
      setError(true);
    }
  }, []);

  React.useEffect(() => {
    // fetchAthelete();
  }, [fetchAthelete]);

  const [authState, setTokens] = useAuth();

  console.log("Strava token: ", authState.tokens.strava);

  const handleConnectClick = () => {
    // redirect to strava auth site
    const REACT_APP_CLIENT_ID = config.client_id; // todo get from env
    const redirectUrl = "http://localhost:3000/redirect";
    const scope = "read";

    const authUrl = `http://www.strava.com/oauth/authorize?client_id=${REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=${redirectUrl}/exchange_token&approval_prompt=force&scope=${scope}`;
    (window as any).location = authUrl;
  };

  if (error) {
    return <div style={{ color: "red" }}>issue fetching athlete</div>;
  }

  return (
    <Grid>
      <Button label="Connect to Strava" onClick={handleConnectClick} />
      <div style={{ color: "white" }}>
        {JSON.stringify(athlete ?? "Loading Athlete", undefined, 2)}
      </div>
    </Grid>
  );
};

// var StravaApiV3 = require('strava_api_v3');
// var defaultClient = StravaApiV3.ApiClient.instance;

// // Configure OAuth2 access token for authorization: strava_oauth
// var strava_oauth = defaultClient.authentications['strava_oauth'];
// strava_oauth.accessToken = "YOUR ACCESS TOKEN"

// var api = new StravaApiV3.AthletesApi()

// var callback = function(error, data, response) {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log('API called successfully. Returned data: ' + data);
//   }
// };
// api.getLoggedInAthlete(callback);
