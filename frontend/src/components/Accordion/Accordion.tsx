import React, { useState, useRef, useEffect, JSXElementConstructor } from "react";
import Chevron from "./Chevron";
import { Song } from "../../models/song";

import "./Accordion.css";
interface AccordionProps {
    mainItem: any;
    subItem: any;
    songLink: string;
    id: string;
    setSong: (song: Song) => void;
    song: Song;
    selectedSong: Song;

}

export const Accordion = (props: AccordionProps) => {
    const [active, setActive] = useState(false);
    const [setHeight, setHeightState] = useState("0px");
    const [setRotate, setRotateState] = useState("accordion__icon");
    const [playing, setPlaying] = useState(false);
    const [audio] = useState(new Audio(props.songLink));
    const { setSong, song, selectedSong } = props
    const [innerChange, setInnerChange] = useState(false)

    useEffect(() => {
        playing ? audio.play() : audio.pause();
    },
        [playing]
    );

    useEffect(() => {
        if (song?.name === selectedSong?.name) {
            setActive(!active)
            setPlaying(!active)
            setHeightState(
                active ? "0px" : `${content.current.scrollHeight}px`
            );
            setRotateState(
                active ? "accordion__icon" : "accordion__icon rotate"
            );

        }
    }, [selectedSong, innerChange])

    const content = useRef(null);

    const toggleAccordion = () => {
        setSong(song)
        setInnerChange(!innerChange)
    }



    return (
        <div id={props.id} className="accordion__section" >
            <button className={`accordion ${active}`} onClick={toggleAccordion} >
                {props.mainItem}
                < Chevron className={`${setRotate}`} width={10} fill={"#777"} />
            </button>
            < div
                ref={content}
                style={{ maxHeight: `${setHeight}` }}
                className="accordion__content"
            >
                <div className="accordion__text">
                    {props.subItem}
                </div>
            </div>
        </div>
    );
}

