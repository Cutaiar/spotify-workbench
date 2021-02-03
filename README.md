<p align="center">
  <a href="https://spotiverse.io/">
    <img
      alt="Spotify Workbench"
      src="frontend/public/spotify-workbench-icon.png"
      width="100"
    />
  </a>
</p>

# Spotify Workbench

The Spotify Workbench is a collection of services built on top of Spotify and other apps which provide the user with advanced musical functionality the the creation and discovery domains.

Services include:

##### `Wallpaper Generator`

##### `Run Playlists`

##### `Music Visualization via canvas`

<br>

_Note: The repo is in some turmoil given that it was recently converted from an imperative react js wallpaper app, to a functional react ts project including many apps. The most notable inconsistency is the lack of a backend which serves the entire app rather than just the wallpaper app. More docs and refactor coming soon._

## Quickstart

- Clone this [repo](https://github.com/Cutaiar/album-cover-wallpaper.git)
- run `./init.cmd` in the root of the repo
- Run the `Start App` task using the command palette (`cmd+shift+p`)

What you've just done is installed all dependencies for the frontend and backend, started the frontend on port 3000 and started the wallpaper service server on port 3001. The frontend will hit port 3001 with all the image URIs and the backend will respond with a base64 encoded stitched wallpaper in the body".

## Styling

This project uses [primereact](https://primefaces.org/primereact/showcase/#/setup) for styling and components.

## Deployment

On every commit to master, Spotify Workbench is deployed to

[`https://spotify-workbench.netlify.app`](https://spotify-workbench.netlify.app)

Be sure that there are no warnings when building locally as all warnings will fail CI. If you need access to the [netlify project](https://app.netlify.com/sites/spotify-workbench/overview), contact dillonc@vt.edu.

## Frontend

The frontend uses React. It was was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In `frontend/`, you can run:

#### `npm start`

Runs the app in the development mode on [`http://localhost:3000`](http://localhost:3000).

#### `npm test`

Launches the test runner in the interactive watch mode. See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

**⚠ Potentially deprecated in favor of webpack ⚠️**

Default create-react-app build. See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run webpack`

Builds the app using webpack.

#### `npm run compile`

Just runs the typescript compiler (`tsc`) according to the `tsconfig.json` in `frontend/`. Usually used to generate an exhaustive list of things you need to fix to compile haha.

#### `npm run eject`

Don't use this unless [you know what you're doing](https://facebook.github.io/create-react-app/docs/deployment).

## Backend

The backend is just a simple express server that listens on `localhost:3001` for `POST` requests that have a `JSON` body. The body should be a `JSON Array` where each element is a `URI` for an album cover. It will stitch these images together into a wallpaper and return the wallpaper as a base64 encoded string in the body of the response.

_More to come..._

### Running

`cd` into `/backend/server` and run `node server.js`. The server will listen on `localhost:3001` for the request described above.

## Services

As mentioned, spotify-workbench is a collection of services. Details on each below.

### Wallpaper Generator

This service generates a phone background using all of your album covers.

### Run Playlists

The idea here is to provide playlists that represent all the songs you just ran to (presumably discovered via radio). This will use the Spotify api to grab your last x songs, and the Strava api to get your most recent run. We can then use timestamps to construct this playlist, create it in your library, and provide a nice image for it.

I have part of this implemented in another project.
