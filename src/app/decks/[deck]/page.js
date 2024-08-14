'use client'
import { useEffect, useState } from "react";
import Flashcard from "@/app/components/flashcard";
import { db } from "@/app/firebase";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { isLoaded,isSignedIn,useUser } from "@clerk/nextjs";



export default function Deck({params}) {
    // access current user data
    const { isSignedIn,isLoaded,user } = useUser();
    const [flashcards, setFlashcards] = useState([
        { front: "Singly-Linked List", back: "A data structure that orders a set of data elements, each containing a link to it's successor." },
        { front: "Stack", back: "A data structure that orders a set of data elements that are placed first in and last out. A real life example is a pile of books; you add and remove a book from the top." }
    ])
   

    const findDeck = async (decodedDeckName) => {
        try {
            const userId = user.id;
            const docRef = collection(db, "users", userId, "flashcards");
            const q = query(docRef, where("deckName", "==", decodedDeckName));
            const docSnap = await getDocs(q);
            const fetchedFlashcards = docSnap.docs.map(doc => doc.data());
            setFlashcards(fetchedFlashcards);
            console.log(fetchedFlashcards);
        } catch (e) {
            console.error("Error fetching flashcards:", e);
        }
    };
     //TODO: use clerk to find the user, then use firebase to find this specific deck
    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            const decodedDeckName = decodeURIComponent(params.deck);
            findDeck(decodedDeckName);
        }
    }, [isLoaded, isSignedIn, user, params.deck]);

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