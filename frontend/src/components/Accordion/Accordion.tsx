import React, { useState, useRef } from "react";
import Chevron from "./Chevron";

import "./Accordion.css";
interface AccordionProps {
    mainItem;
    subItem;

}


export const Accordion = (props: AccordionProps) => {
    const [setActive, setActiveState] = useState("");
    const [setHeight, setHeightState] = useState("0px");
    const [setRotate, setRotateState] = useState("accordion__icon");

    const content = useRef(null);

    function toggleAccordion() {
        setActiveState(setActive === "" ? "active" : "");
        setHeightState(
            setActive === "active" ? "0px" : `${content.current.scrollHeight}px`
        );
        setRotateState(
            setActive === "active" ? "accordion__icon" : "accordion__icon rotate"
        );
    }

    return (
        <div className="accordion__section" >
            <button className={`accordion ${setActive}`} onClick={toggleAccordion} >
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

