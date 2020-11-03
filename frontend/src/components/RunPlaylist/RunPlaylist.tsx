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
import { Toast, ToastMessage } from "primereact/toast";
import { findAllByTestId } from "@testing-library/react";

interface IRunPlaylistProps {
  spotifyUser: ISpotifyUser;
}
interface ISongItem {
  name: string;
  image: string;
  artist: string;
  uri: string;
  preview_url: string;
  onClick: (preview_url?: string) => void;
}

const playlistName = "wb-recents";

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
        preview_url: song.track.preview_url,
        onClick: () => onSongItemClicked(song.track.preview_url),
      } as ISongItem;
    });
    setSongItems(songItems);
  };

  const [selectedSongItems, setSelectedSongItems] = React.useState(undefined);
  const [songItems, setSongItems] = React.useState<ISongItem[]>([]);
  const playingSong = React.useRef<HTMLAudioElement>(undefined);

  const onSongItemClicked = (preview_url: string) => {
    console.log("click");
    console.log(playingSong);
    playingSong.current?.pause();
    if (preview_url !== undefined) {
      const newSong = new Audio(preview_url);
      newSong.volume = 0.1;
      newSong.load();
      newSong.play();
      playingSong.current = newSong;
    }
  };

  const songItemTemplate = (option: any) => {
    return (
      <div className={"p-d-flex"}>
        <div className="p-mr-2" style={{ width: "40px" }}>
          <img
            alt={""}
            onError={(e) => {
              let target = e.target as HTMLInputElement;
              target.onerror = null;
              target.src =
                "https://via.placeholder.com/150/000000/FFFFFF/?text=issue loading image";
            }}
            src={option.image}
            height={40}
          />
        </div>
        <div className="p-d-flex p-flex-column p-jc-center song-info-container">
          <div className="song-item-title p-text-truncate p-text-nowrap p-text-left p-mb-1">
            {option.name}
          </div>
          <div className="song-item-artist p-text-truncate p-text-left">
            {option.artist}
          </div>
        </div>
      </div>
    );
  };

  const saveToPlaylist = async () => {
    const id = (await props.spotifyUser.spotifyApi.getMe()).id;
    const playlist = await props.spotifyUser.spotifyApi.createPlaylist(id, {
      name: playlistName,
      public: false,
    });
    props.spotifyUser.spotifyApi
      .addTracksToPlaylist(
        playlist.id,
        songItems.map((s) => {
          return s.uri;
        })
      )
      .then((_) => {
        showSaveToPlaylistToast(true);
      })
      .catch((error) => {
        console.error("Encountered an error saving playlist");
        console.log(error);
        showSaveToPlaylistToast(false);
      });
  };

  const saveToPlaylistSuccessToast = React.createRef<Toast>();
  const showSaveToPlaylistToast = (success: boolean) => {
    const successToast: ToastMessage = {
      severity: "success",
      summary: "Created a new playlist",
      detail: `${numberOfSongsToFetch} added to ${playlistName}`,
      closable: false,
    };

    const failToast: ToastMessage = {
      severity: "error",
      summary: "Playlist not created",
      detail: `Encountered an issue`,
    };

    saveToPlaylistSuccessToast.current?.show(
      success ? successToast : failToast
    );
  };

  const fetchLimit = 50;
  const isInputValid = () => {
    return numberOfSongsToFetch < fetchLimit + 1 && numberOfSongsToFetch > 0;
  };

  const onListBoxChange = (e: any) => {
    setSelectedSongItems(e.value);
    if (e.value === null) {
      playingSong.current?.pause();
    } else {
      e.value.onClick();
    }
  };

  return (
    <div className={"RunPlaylistRoot"}>
      <Toast ref={saveToPlaylistSuccessToast} position="bottom-right" />
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
            <small className="p-invalid">{`Between 0 and ${fetchLimit}`}</small>
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
          style={{
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <ListBox
            value={selectedSongItems}
            options={songItems}
            onChange={onListBoxChange}
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
