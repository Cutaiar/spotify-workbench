import { Box, Button, Select, Spinner } from "grommet";
import * as React from "react";
import {
  AthleteResponse,
  ActivitiesRoutes,
  default as stravaApi,
  Strava,
} from "strava-v3";
import { useAuth } from "../../context/authContext";
import { AccountBadge } from "../AccountBadge";
import { style } from "./StravaPage.style";
import * as polylineUtil from "@mapbox/polyline";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

export const StravaPage: React.FC = () => {
  const [athlete, setAthlete] = React.useState<AthleteResponse>();
  const [polyline, setPolyline] = React.useState<any>();
  const [data, setData] = React.useState<any>();
  const [error, setError] = React.useState(false);
  const [authState, setTokens] = useAuth();

  const [value, setValue] = React.useState("distance");

  const streamOptions = [
    "time",
    "distance",
    "heartrate",
    "altitude",
    "latlng",
    "velocity_smooth",
    "cadence",
    "watts",
    "temp",
    "moving",
    "grade_smooth",
  ];

  const strava = React.useMemo(() => {
    if (authState.tokens.strava) {
      const config = {
        access_token: authState.tokens.strava,
        client_id: process.env.REACT_APP_STRAVA_CLIENT_ID,
        client_secret: process.env.REACT_APP_STRAVA_CLIENT_SECRET,
        redirect_uri: "http://localhost:3000/redirect",
      };
      const strava = new stravaApi.client(config.access_token);
      return strava;
    }
  }, [authState.tokens.strava]);

  React.useEffect(() => {
    if (strava) {
      const fetchAthelete = async () => {
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
  }, [strava]);

  React.useEffect(() => {
    if (strava) {
      const fetchFirstActivity = async () => {
        try {
          const activities = await strava.athlete.listActivities({});
          const firstId = activities[0].id;
          const firstActivity = await strava.activities.get({ id: firstId });
          const encodedPolyline = firstActivity.map.polyline;
          const decodedPolyLine = polylineUtil.decode(encodedPolyline);
          //--
          //todo: how to use this stream against spotify timestamps
          const llstream = await strava.streams.activity({
            types: streamOptions,
            id: firstId,
          });

          // const data = [
          //   {
          //     name: "index",
          //     time: 400,
          //     distance: 2400,
          //     altitude: 2400,
          //     heartrate: 100,
          //   },
          // ];
          const mapData = (streams: any[]) => {
            const final = [];

            const firstStream = streams[0];

            firstStream.data.forEach((element, i) => {
              const obj = { name: i, [firstStream["type"]]: element };
              for (let j = 1; j < streams.length; j++) {
                obj[streams[j]["type"]] = streams[j]["data"][i];
              }
              final.push(obj);
            });
            return final;
          };

          const data = mapData(llstream);

          setData(data);
          console.log("llstrameam:");
          console.dir(llstream);

          //--
          setPolyline(decodedPolyLine);
        } catch (error) {
          console.log(error);
        }
      };
      fetchFirstActivity();
    }
  }, [strava]);

  const handleConnectClick = () => {
    // redirect to strava auth site
    const REACT_APP_CLIENT_ID = process.env.REACT_APP_STRAVA_CLIENT_ID;
    const redirectUrl = "http://localhost:3000/redirect";
    const scope = "read_all%2Cactivity%3Aread_all";

    const authUrl = `http://www.strava.com/oauth/authorize?client_id=${REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=${redirectUrl}/exchange_token&approval_prompt=force&scope=${scope}`;
    (window as any).location = authUrl;
  };

  if (error) {
    return <div style={{ color: "red" }}>issue fetching athlete</div>;
  }

  const Map = () => {
    // Can't show the map unless we have a polyline yet
    if (!polyline) {
      return (
        <Box align="center" justify="center" fill style={style.root}>
          <Spinner />
        </Box>
      );
    }

    // Center on the first point in the polyline for now
    const center = polyline[0];

    // todo calc zoom based on size of poly line

    return (
      // <MapContainer center={center} zoom={13} style={{ height: "100%" }}>
      //   <TileLayer
      //     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      //     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      //   />
      //   {polyline && <Polyline positions={polyline} />}
      // </MapContainer>

      <Box align="center" justify="center" fill style={style.root}>
        <ResponsiveContainer width={"80%"} height="80%">
          <LineChart data={data}>
            <XAxis label={"time"} stroke="darkgray" tick={false} />
            <YAxis label={value} dataKey={value} stroke="darkgray" />
            <Line type="monotone" dataKey={value} stroke="red" dot={false} />
          </LineChart>
        </ResponsiveContainer>

        <Select
          options={streamOptions}
          disabled={streamOptions.filter((option) => {
            return !Object.keys(data[0]).includes(option);
          })}
          value={value}
          onChange={({ option }) => setValue(option)}
        />
      </Box>
    );
  };

  return (
    <>
      {!athlete && (
        <Box align="center" justify="center" fill style={style.root}>
          <Button
            primary
            label="Connect to Strava"
            onClick={handleConnectClick}
          />
        </Box>
      )}

      {athlete && (
        <>
          <AccountBadge
            name={athlete.firstname + " " + athlete.lastname}
            imageUrl={athlete.profile}
            accountType="strava"
            onClickLogout={() => {}}
          />
          {Map()}
        </>
      )}
    </>
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
