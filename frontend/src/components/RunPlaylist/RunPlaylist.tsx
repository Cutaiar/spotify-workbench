import { Button } from "primereact/button";
import { ListBox } from "primereact/listbox";
import * as React from "react";
import { getImageForSpotifyTracks } from "../../common/util";
import { ISpotifyUser } from "../App/App";
import "primeflex/primeflex.css";
import { Slider } from "primereact/slider";
import { InputText } from "primereact/inputtext";
import "./RunPlaylist.css";
import { Toast, ToastMessage } from "primereact/toast";
import { SongListItem } from "./SongListItem";

interface IRunPlaylistProps {
  spotifyUser: ISpotifyUser;
}
export interface ISongItem {
  name: string;
  image: string;
  artist: string;
  uri: string;
  preview_url: string;
  onClick: (preview_url?: string) => void;
}

const playlistName = "wb-recents";
const fetchLimit = 50;

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

    // The data entities which back the options for the listbox
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
  const saveToPlaylistSuccessToast = React.createRef<Toast>();

  const onSongItemClicked = (preview_url: string) => {
    playingSong.current?.pause();
    if (preview_url !== undefined) {
      const newSong = new Audio(preview_url);
      newSong.volume = 0.1;
      newSong.load();
      newSong.play();
      playingSong.current = newSong;
    }
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
        <div className="p-p-1" style={{ width: "170px" }}>
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
      <div className="p-d-flex" style={{ height: "100%" }}>
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
            itemTemplate={(item: ISongItem) => {
              return <SongListItem item={item} />;
            }}
            style={{ width: "500px" }}
            listStyle={{ maxHeight: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};
