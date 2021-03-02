import { Song } from "../../models/song"
import { ISpotifyUser } from "../App/App";
import React from "react";
// import { ProgressBar } from '@bit/primefaces.primereact.progressbar'
import { Button } from "primereact/button";
import { Accordion } from "../Accordion/Accordion"
import "./SongList.css"

interface ISongListProps {
    songs: Song[];
}

interface ISongList {
    spotifyUser?: ISpotifyUser;
}
interface ISongListState {
    songs: Song[];
    showList: boolean;
}

export const SongList: React.FC<ISongList & ISongListProps> = (props: ISongListProps) => {
    const initialState: ISongListState = {
        songs: props.songs,
        showList: false,
    };
    const [state, setState] = React.useState<ISongListState>(
        initialState
    );

    // const getLikedSongs = async () => {
    //     const songs = await getUsersLikedSongs(props?.spotifyUser?.token);
    //     setState({
    //         songs: songs,
    //         showList: true
    //     })
    // }

    const item = (content: string, url: string) => {
        return <div className="mainContent">
            <p className="trackTitle">{content}</p>
            <img className="trackImage" src={url} />
        </div>
    }

    const getSubContent = (artist: string, popularity: number) => {
        return <p className="trackTitle">{artist + " has a populatiry of " + popularity}</p>
    }
    return (
        <>
            <div >
                {state.songs.map(song => (
                    <Accordion
                        mainItem={item(song.name, song.imageLink)} subItem={getSubContent(song.artist, song.popularity)} songLink={song.previewUrl} />
                ))}
            </div>
        </>
    )
}