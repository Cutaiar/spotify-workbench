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
    const [height, setHeight] = useState("0px");
    const [rotate, setRotate] = useState("accordion__icon");
    const [playing, setPlaying] = useState(false);
    const [audio, setAudio] = useState(new Audio(props.songLink));
    const { setSong, song, selectedSong } = props
    const [innerChange, setInnerChange] = useState(false)
    const content = useRef(null);

    useEffect(() => {
        setAudio(new Audio(props.songLink))
    }, [props.song])

    useEffect(() => {
        playing ? audio.play() : audio.pause();
    },
        [playing]
    );

    useEffect(() => {
        //Below logic can def be simplified just made sense in my head for now
        if (song === selectedSong) {
            if (!active) {
                setActive(true)
                setPlaying(true)
                setHeight(`${content.current.scrollHeight}px`)
                setRotate("accordion__icon rotate")
                content.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
            }
            else {
                setActive(false)
                setSong(null)
                setPlaying(false)
                setHeight("0px")
                setRotate("accordion__icon")
            }
        }
        else {
            setActive(false)
            setPlaying(false)
            setHeight("0px")
            setRotate("accordion__icon")
        }
    }, [selectedSong, innerChange])


    const toggleAccordion = () => {
        if (!active)
            setSong(song)
        setInnerChange(!innerChange)
    }



    return (
        <div ref={content} id={props.id} className="accordion__section" >
            <button className={`accordion ${active}`} onClick={toggleAccordion} >
                {props.mainItem}
                < Chevron className={`${rotate}`} width={10} fill={"#777"} />
            </button>
            < div
                style={{ maxHeight: `${height}` }}
                className="accordion__content"
            >
                <div className="accordion__text">
                    {props.subItem}
                </div>
            </div>
        </div>
    );
}



