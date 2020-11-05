import React from "react";
import { ISongItem } from "./RunPlaylist";

export interface ISongItemProps {
  item: ISongItem;
}

/**
 * Returns a list item representing a song to be used in a primeface ListBox.
 *
 * @param props requires item field which is passed in when used as an itemTemplate in a primeface ListBox
 */
export const SongListItem: React.FC<ISongItemProps> = (props) => {
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
          src={props.item.image}
          height={40}
        />
      </div>
      <div className="p-d-flex p-flex-column p-jc-center song-info-container">
        <div className="song-item-title p-text-truncate p-text-nowrap p-text-left p-mb-1">
          {props.item.name}
        </div>
        <div className="song-item-artist p-text-truncate p-text-left">
          {props.item.artist}
        </div>
      </div>
    </div>
  );
};
