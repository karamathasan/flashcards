import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const DeckCard = (props) => {
    return (
        <div className="rounded-[25px] py-[1rem] px-[1.5rem] w-[90vw] sm:w-[80vw] md:w-[70vw] flex flex-row justify-between items-center bg-[#4bacfc] text-[#ededed]">
            <div className="flex flex-col h-full">
                <h1 className="capitalize text-[30px] ">{props.title}</h1>
                <p>{props.numCards} {props.numCards != 1 ? ("Flashcards") : ("Flashcard")} </p>
            </div>
            <Link href={`/decks/${props.title}`}>
                <FontAwesomeIcon className={"cursor-pointer text-[2.5rem]"} icon={faCircleArrowRight} />
            </Link>

        </div>
    )
}

export default DeckCard;