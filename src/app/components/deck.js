import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";

const DeckCard = (props) => {
    return (
        <div className="rounded-[25px] py-[1rem] px-[1.5rem] w-[23rem] h-[15rem] flex flex-row justify-between items-center bg-[#4bacfc] text-[#ededed]">
            <div className="flex flex-col h-full">
                <h1 className="capitalize text-[30px] ">{props.title}</h1>
                <p>12 Cards</p>
            </div>
            <FontAwesomeIcon className={"cursor-pointer text-[2.5rem]"} icon={faCircleArrowRight} />

        </div>
    )
}

export default DeckCard;