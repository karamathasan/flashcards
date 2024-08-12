'use client'
import Flashcard from "../components/flashcard";

const flashcards = [
    { front: "Singly-Linked List", back: "A data structure that orders a set of data elements, each containing a link to it's successor." },
    { front: "Stack", back: "A data structure that orders a set of data elements that are placed first in and last out. A real life example is a pile of books; you add and remove a book from the top." }
]

export default function Deck() {
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

