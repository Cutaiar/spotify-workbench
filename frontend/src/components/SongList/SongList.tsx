import { Song } from "../../models/song";
import { ISpotifyUser } from "../SpotifyConnectButton/SpotifyConnectButton";
import React, { useEffect, useState } from "react";

import { Accordion } from "../Accordion/Accordion";
import "./SongList.css";

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

export const SongList: React.FC<ISongList & ISongListProps> = (
  props: ISongListProps
) => {
  const [songs, setSongs] = useState(props.songs);
  // const [song, setSong] = useState(props.song)
  const [showList, setShowList] = useState(false); //???????
  const { setSong } = props;

  useEffect(() => {
    setSongs(props.songs);
  }, [props.songs]);

  const getSongList = () => {
    return songs.map((song, i) => (
      <Accordion
        song={song}
        setSong={setSong}
        selectedSong={props.song}
        id={i.toString()}
        mainItem={item(song.name, song.artist, song.imageLink)}
        subItem={getSubContent(song.artist, song.popularity)}
        songLink={song.previewUrl}
      />
    ));
  };

  const item = (name: string, artist: string, url: string) => {
    return (
      <div className="mainContent">
        <img className="trackImage" src={url} />
        <div className="songInfo">
          <p className="trackTitle">{name}</p>
          <p className="trackArtist">{artist}</p>
        </div>
      </div>
    );
  };

  const getSubContent = (artist: string, popularity: number) => {
    return (
      <p className="subcontentText">
        {artist + " has a populatiry of " + popularity}
      </p>
    );
  };
  return (
    <>
      <div>{getSongList()}</div>
    </>
  );
};
