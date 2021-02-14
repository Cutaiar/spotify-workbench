import { getUsersLikedSongs, Song } from "../../spotiverse-functions"
import { ISpotifyUser } from "../App/App";
import React from "react";
import { Button } from "primereact/button";
import { Accordion } from "../Accordion/Accordion"
import "./SongList.css"


interface ISongList {
    spotifyUser?: ISpotifyUser;
}
interface ISongListState {
    songs: Song[]; //this is lazy fix this later
    showList: boolean;
}

export const SongList: React.FC<ISongList> = (props) => {
    const initialState: ISongListState = {
        songs: undefined,
        showList: false,
    };
    const [state, setState] = React.useState<ISongListState>(
        initialState
    );

    const getLikedSongs = async () => {
        const songs = await getUsersLikedSongs(props?.spotifyUser?.token);
        setState({
            songs: songs,
            showList: true
        })
    }

    const item = content => {
        return <p>{content}</p>
    }
    return (
        <>
            <Button
                className="p-button-primary p-m-2"
                onClick={getLikedSongs}
                disabled={!props.spotifyUser?.token}
                icon="pi pi-images"
                label="Get Song List"
            ></Button>
            <div>
                {state.showList && state.songs.map(song => (
                    <Accordion
                        mainItem={item(song.name)} subItem={item(song.artist)} />
                    // <p className="songListItem" key={song.name}>{song.name}</p>
                ))}
            </div>
        </>
    )
}