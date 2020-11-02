import { Button } from "primereact/button";
import { ListBox } from "primereact/listbox";
import * as React from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { getImageForSpotifyTracks } from "../../common/util";
import { ISpotifyUser } from "../App/App";
import "primeflex/primeflex.css";
import { Slider } from "primereact/slider";
import { InputText } from "primereact/inputtext";
import "./RunPlaylist.css";

interface IRunPlaylistProps {
  spotifyUser: ISpotifyUser;
}

export const RunPlaylist: React.FunctionComponent<IRunPlaylistProps> = (
  props
) => {
  const [numberOfSongsToFetch, setNumberOfSongsToFetch] = React.useState(10);

  const getRecentSongs = async () => {
    const options: SpotifyApi.RecentlyPlayedParameterObject = {
      limit: numberOfSongsToFetch,
    };
    const songs = await props.spotifyUser.spotifyApi.getMyRecentlyPlayedTracks(
      options
    );
    const songIds = songs.items.map((song) => {
      return song.track.id;
    });

    // Temporarily get the images manually cause SpotifyWebApi don't have em
    const songImageUris = await getImageForSpotifyTracks(
      props.spotifyUser.spotifyApi,
      songIds
    );

    const songItems = songs.items.map((song, i) => {
      return {
        name: song.track.name,
        image: (songImageUris as any[])[i],
        artist: song.track.artists[0].name,
        uri: song.track.uri,
      };
    });
    setSongItems(songItems);
  };

  const [selectedSongItems, setSelectedSongItems] = React.useState(undefined);
  const [songItems, setSongItems] = React.useState([]);

  const songItemTemplate = (option: any) => {
    return (
      <div className={"p-grid"}>
        <div className="p-col-fixed" style={{ width: "100px" }}>
          <img alt={option.name} src={option.image} />
        </div>
        <div className="p-grid p-dir-col">
          <div className="p-col">{option.name}</div>
          <div className="p-col">{option.artist}</div>
        </div>
      </div>
    );
  };

  const saveToPlaylist = async () => {
    const id = (await props.spotifyUser.spotifyApi.getMe()).id;
    const playlist = await props.spotifyUser.spotifyApi.createPlaylist(id, {
      name: "wb-recents",
      public: false,
    });
    await props.spotifyUser.spotifyApi.addTracksToPlaylist(
      playlist.id,
      songItems.map((s) => {
        return s.uri;
      })
    );
  };

  const fetchLimit = 50;
  const isInputValid = () => {
    return numberOfSongsToFetch < fetchLimit + 1 && numberOfSongsToFetch > 0;
  };

  return (
    <div className={"RunPlaylistRoot"}>
      <h2> Run Playlists</h2>
      <div className={"p-d-flex p-jc-center p-ai-center p-p-1"}>
        <div className="p-p-1" style={{ width: "200px" }}>
          <InputText
            style={{ width: "100%" }}
            value={numberOfSongsToFetch}
            keyfilter={"int"}
            className={isInputValid() ? "" : "p-invalid"}
            onChange={(e) => {
              let target = e.target as HTMLInputElement;
              setNumberOfSongsToFetch(+target.value);
            }}
          />
          <Slider
            min={1}
            max={50}
            value={numberOfSongsToFetch}
            onChange={(e) => {
              setNumberOfSongsToFetch(e.value as number);
            }}
          />
          {!isInputValid() && (
            <small className="p-invalid">
              {" "}
              {`Between 0 and ${fetchLimit}`}
            </small>
          )}
        </div>

        <Button
          onClick={() => getRecentSongs()}
          disabled={!props.spotifyUser || !isInputValid()}
          className="p-m-2"
        >
          Get Recent Songs
        </Button>
        <Button
          onClick={() => saveToPlaylist()}
          disabled={!props.spotifyUser || songItems.length <= 0}
          className="p-m-2"
        >
          Save to Playlist
        </Button>
      </div>
      <div className="p-d-flex " style={{ height: "100%" }}>
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <ListBox
            value={selectedSongItems}
            options={songItems}
            onChange={(e) => setSelectedSongItems(e.value)}
            filter
            optionLabel="name"
            itemTemplate={songItemTemplate}
            style={{ width: "500px" }}
            listStyle={{ maxHeight: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};
