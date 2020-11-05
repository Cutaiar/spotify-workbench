import { Button } from "primereact/button";
import React from "react";
import { ISongItem } from "./RunPlaylist";

export interface ISongListItemProps {
  item: ISongItem;
  isPlaying: boolean;
}

const songItemCommandButtonClassNames =
  "p-button-rounded p-button-text p-butt-sm p-button-secondary";
/**
 * Returns a list item representing a song to be used in a primeface ListBox.
 *
 * @param props requires item field which is passed in when used as an itemTemplate in a primeface ListBox
 */
export const SongListItem: React.FC<ISongListItemProps> = (props) => {
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
      <div className="p-d-flex p-flex-column p-jc-center song-info-container p-mr-auto">
        <div className="song-item-title p-text-truncate p-text-nowrap p-text-left p-mb-1">
          {props.item.name}
        </div>
        <div className="song-item-artist p-text-truncate p-text-left">
          {props.item.artist}
        </div>
      </div>
      <div>
        <div className="song-item-commands p-d-flex p-jc-end p-ai-center">
          {props.isPlaying && (
            <Button
              icon={"pi pi-volume-up"}
              className={songItemCommandButtonClassNames}
            />
          )}
          <Button
            icon="pi pi-times"
            className={songItemCommandButtonClassNames}
            tooltip="Remove from list"
            tooltipOptions={{
              position: "top",
            }}
            onClick={() => {
              console.log("Remove from list");
              window.location.href = props.item.link;
            }}
          />
          <Button
            icon="pi pi-heart"
            className={songItemCommandButtonClassNames}
            tooltip="Like on spotify"
            tooltipOptions={{
              position: "top",
            }}
            onClick={() => {
              console.log("Like on spotify");
              window.location.href = props.item.link;
            }}
          />
          <Button
            icon="pi pi-external-link"
            className={songItemCommandButtonClassNames}
            tooltip="Open in spotify"
            tooltipOptions={{
              position: "top",
            }}
            onClick={() => {
              console.log("Open in spotify");
              window.location.href = props.item.link;
            }}
          />
        </div>
      </div>
    </div>
  );
};
