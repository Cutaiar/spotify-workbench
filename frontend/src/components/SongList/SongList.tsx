import { Song } from "../../models/song"
import { ISpotifyUser } from "../App/App";
import React, { useEffect, useState } from "react";
// import { ProgressBar } from '@bit/primefaces.primereact.progressbar'
import { Button } from "primereact/button";
import { Accordion } from "../Accordion/Accordion"
import "./SongList.css"

interface ISongListProps {
    songs: Song[];
    song: Song;
    setSong: (song: Song) => void;
}

interface ISongList {
    spotifyUser?: ISpotifyUser;
}
interface ISongListState {
    songs: Song[];
    showList: boolean;
}

export const SongList: React.FC<ISongList & ISongListProps> = (props: ISongListProps) => {
    const [songs, setSongs] = useState(props.songs);
    // const [song, setSong] = useState(props.song)
    const [showList, setShowList] = useState(false);//???????

    const getSongList = () => {
        return songs.map((song, i) => (
            <Accordion
                id={i.toString()} mainItem={item(song.name, song.imageLink)} subItem={getSubContent(song.artist, song.popularity)} songLink={song.previewUrl} />
        ))
    }

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
            {/* {"poopy" +props?.song?.name} */}
            <div >
                {getSongList()}
            </div>
        </>
    )
}