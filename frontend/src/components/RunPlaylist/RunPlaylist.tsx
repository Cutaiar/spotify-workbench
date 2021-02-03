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
  link: string;
}

type ProgressState = "not started" | "in progress" | "success" | "error";
const fetchLimit = 50;

export const RunPlaylist: React.FunctionComponent<IRunPlaylistProps> = (
  props
) => {
  const [numberOfSongsToFetch, setNumberOfSongsToFetch] = React.useState(10);
  const [playlistName, setPlaylistName] = React.useState<string>("sw-recents");

  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [progressState, setProgressState] = React.useState<ProgressState>(
    "not started"
  );

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
        link: song.track.external_urls.spotify,
      } as ISongItem;
    });
    setSongItems(songItems);
  };

  const [selectedSongItems, setSelectedSongItems] = React.useState(undefined);
  const [songItems, setSongItems] = React.useState<ISongItem[]>([]);
  const songAudio = React.useRef<HTMLAudioElement>(undefined);
  const saveToPlaylistSuccessToast = React.createRef<Toast>();
  const createPlaylistToast = React.createRef<Toast>();

  const handleSongItemClicked = (song: ISongItem) => {
    handleAudioForSongClick(song);
  };

  const handleAudioForSongClick = (song: ISongItem) => {
    songAudio.current?.pause();
    if (song.preview_url !== undefined) {
      const newAudio = new Audio(song.preview_url);
      newAudio.volume = 0.1;
      newAudio.load();
      newAudio.play();
      songAudio.current = newAudio;
    }
  };

  const saveToPlaylist = async () => {
    setProgressState("in progress");
    const id = (await props.spotifyUser.spotifyApi.getMe()).id;
    const playlist = await props.spotifyUser.spotifyApi
      .createPlaylist(id, {
        name: playlistName,
        public: false,
      })
      .catch((e) => {
        console.error("Encountered an error saving playlist");
        console.log(e);
        setProgressState("error");
      });

    if (playlist) {
      const addTracksResp = await props.spotifyUser.spotifyApi
        .addTracksToPlaylist(
          playlist.id,
          songItems.map((s) => {
            return s.uri;
          })
        )
        .catch((e) => {
          console.error("Encountered an error saving playlist");
          console.log(e);
          setProgressState("error");
        });

      if (addTracksResp) {
        setPlaylistName(null);
        setProgressState("success");
      }
    }
  };

  const toastMessage: ToastMessage = React.useMemo(() => {
    return {
      severity: "info",
      sticky: true,
      content: (
        <div className="p-d-flex p-flex-row p-ai-center" style={{ flex: "1" }}>
          <div className="p-mr-2">
            <InputText
              value={playlistName}
              onChange={(e) => {
                setPlaylistName((e.target as HTMLInputElement).value);
              }}
              autoFocus
              placeholder={playlistName}
              disabled
            />
          </div>
          <div className="p-mr-2">
            <Button
              label="Save"
              className="p-button-primary"
              onClick={async () => {
                await saveToPlaylist();
                // createPlaylistToast.current?.clear(); // WHY DOES THIS NOT WORK
              }}
            />
          </div>
        </div>
      ),
    };
  }, [
    playlistName,
    saveToPlaylist,
    progressState,
    createPlaylistToast.current,
  ]);

  const showCreatePlaylistToast = React.useCallback(() => {
    createPlaylistToast.current?.show(toastMessage);
  }, [createPlaylistToast, toastMessage]);

  const isInputValid = () => {
    return numberOfSongsToFetch < fetchLimit + 1 && numberOfSongsToFetch > 0;
  };

  const onListBoxChange = (e: any) => {
    setSelectedSongItems(e.value);
    setActiveIndex(songItems.findIndex((s) => s === e.value));
    if (!e.value) {
      songAudio.current?.pause();
    } else {
      handleSongItemClicked(e.value);
    }
  };

  return (
    <div className={"RunPlaylistRoot"}>
      <Toast ref={saveToPlaylistSuccessToast} position="bottom-right" />
      <Toast
        ref={createPlaylistToast}
        position="bottom-right"
        onRemove={() => console.log("toast removed")}
      />

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
          onClick={() => showCreatePlaylistToast()}
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
              return (
                <SongListItem
                  isPlaying={item == selectedSongItems}
                  item={item}
                />
              );
            }}
            style={{ width: "500px" }}
            listStyle={{ maxHeight: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};
