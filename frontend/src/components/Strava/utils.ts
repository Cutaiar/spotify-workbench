const { REACT_APP_STRAVA_CLIENT_ID, REACT_APP_STRAVA_CLIENT_SECRET } =
  process.env;

export const getParamValues = (url: string) => {
  return url
    .slice(1)
    .split("&")
    .reduce((prev: string, curr) => {
      const [title, value] = curr.split("=");
      // @ts-ignore
      prev[title] = value;
      return prev;
    }, "");
};

export const cleanUpAuthToken = (str: string) => {
  return str.split("&")[1].slice(5);
};

/**
 * Trade the strava API an auth token for an access and refresh token
 */
export const getAccessAndRefreshTokens = async (authToken: string) => {
  try {
    const response = await fetch(
      `https://www.strava.com/api/v3/oauth/token?client_id=${REACT_APP_STRAVA_CLIENT_ID}&client_secret=${REACT_APP_STRAVA_CLIENT_SECRET}&code=${authToken}&grant_type=authorization_code`,
      { method: "POST" }
    );
    return response;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const getUserData = async (userID: string, accessToken: string) => {
  try {
    const response = await fetch(
      `https://www.strava.com/api/v3/athletes/${userID}/stats`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
