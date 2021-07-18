export type Features = {
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  timeSignature: number;
};

export const randomFeatures = (): Features => {
  return {
    danceability: Math.random(),
    energy: Math.random(),
    key: Math.random(),
    loudness: Math.random(),
    mode: Math.random(),
    speechiness: Math.random(),
    acousticness: Math.random(),
    instrumentalness: Math.random(),
    liveness: Math.random(),
    valence: Math.random(),
    tempo: Math.random(),
    timeSignature: Math.random(),
  };
};
