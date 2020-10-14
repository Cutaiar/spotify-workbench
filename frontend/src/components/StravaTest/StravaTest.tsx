import { Button } from "primereact/button";
import React, { useState } from "react";
import hash from "../../common/hash";
import stravaApi from "strava-v3";

/*
 * Application configuration, all values set via environment variables.
 */
const config = {
  access_token: process.env.REACT_APP_STRAVA_ACCESS_TOKEN,
  client_id: process.env.REACT_APP_STRAVA_CLIENT_ID,
  client_secret: process.env.REACT_APP_STRAVA_CLIENT_SECRET,
  redirect_uri: process.env.REACT_APP_STRAVA_REDIRECT_URI,
};

const connectToStravaLink =
  "http://www.strava.com/oauth/authorize?client_id=54845&response_type=code&redirect_uri=http://localhost:3000/runplaylist&approval_prompt=force&scope=read";

export const StravaTest: React.FC = (props) => {
  const [token, setToken] = React.useState(undefined);
  const [athlete, setAthlete] = React.useState(" No athlete");
  const [stravaClient, setStravaClient] = useState(undefined);

  const getAthlete = () => {
    stravaClient?.athlete
      .get({})
      .then((resp: any) => setAthlete(resp))
      .catch((e: any) => {
        setAthlete("Error fetching athlete");
        console.error(e);
      });
  };

  React.useEffect(() => {
    const clientSetup = async () => {
      // Configure stravaApi to environment vars
      stravaApi.config(config);
      setStravaClient(stravaApi);
      // Get auth code from strava so we can use it to get access token
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const _code = urlParams.get("code");
      if (_code) {
        // const token = await stravaApi.oauth.getToken(_code);
        // const client: any = new (stravaApi.client as any)(token);
        // setStravaClient(client);
      }
    };
    clientSetup();
  }, [hash]);

  return (
    <>
      <Button
        onClick={() => {
          window.location.href = connectToStravaLink;
        }}
        icon={"pi pi-sign-in"}
        label={"Connect To Strava"}
      ></Button>
      <Button onClick={getAthlete}>Get Athlete</Button>
      <h1 style={{ color: "white" }}>{athlete}</h1>
    </>
  );
};
