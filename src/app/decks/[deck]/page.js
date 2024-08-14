'use client'
import { useEffect, useState } from "react";
import Flashcard from "@/app/components/flashcard";

import { db } from "@/app/firebase";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
// import user

export default function Deck({params}) {
    const [flashcards, setFlashcards] = useState([
        { front: "Singly-Linked List", back: "A data structure that orders a set of data elements, each containing a link to it's successor." },
        { front: "Stack", back: "A data structure that orders a set of data elements that are placed first in and last out. A real life example is a pile of books; you add and remove a book from the top." }
    ])
    useEffect(()=>{
        console.log(params.deck)
        //TODO: use clerk to find the user, then use firebase to find this specific deck
        // const userRef = 
    },[])
    return (
        <main className={"w-screen h-full min-h-screen flex flex-col justify-center items-center space-y-[5rem]"}>
            <div className="flex flex-col justify-center items-center space-y-[2rem]">
                {flashcards.map((flashcard, index) =>
                    <Flashcard key={index} front={flashcard.front} back={flashcard.back} />
                )}
            </div>
        </main>
    )
}

