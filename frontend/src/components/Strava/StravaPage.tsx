import { Button, Grid } from "grommet";
import * as React from "react";
import { AthleteResponse, default as stravaApi, Strava } from "strava-v3";
import { useAuth } from "../../context/authContext";
import { AccountBadge } from "../AccountBadge";

export const StravaPage: React.FC = () => {
  const [athlete, setAthlete] = React.useState<AthleteResponse>();
  const [error, setError] = React.useState(false);
  const [authState, setTokens] = useAuth();

  React.useEffect(() => {
    if (authState.tokens.strava) {
      const config = {
        access_token: authState.tokens.strava,
        client_id: process.env.REACT_APP_STRAVA_CLIENT_ID,
        client_secret: process.env.REACT_APP_STRAVA_CLIENT_SECRET,
        redirect_uri: "http://localhost:3000/redirect",
      };
      const fetchAthelete = async () => {
        const strava = new stravaApi.client(config.access_token);
        try {
          const payload = await strava.athlete.get({});
          console.log(payload);
          setAthlete(payload);
          setError(false);
        } catch (error) {
          console.log(error);
          setError(true);
        }
      };
      fetchAthelete();
    }
  }, [authState]);

  const handleConnectClick = () => {
    // redirect to strava auth site
    const REACT_APP_CLIENT_ID = process.env.REACT_APP_STRAVA_CLIENT_ID;
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
      {athlete && (
        <AccountBadge
          name={athlete.firstname + " " + athlete.lastname}
          imageUrl={athlete.profile}
          accountType="strava"
          onClickLogout={() => {}}
        />
      )}
    </Grid>
  );
};

// Does this shit even work?
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
