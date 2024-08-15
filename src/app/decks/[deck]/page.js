'use client'
import { useEffect, useState } from "react";
// import Flashcard from "@/app/components/flashcard";
import Flashcard from "../../components/flashcard";
import Dropdown from "../../components/dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

// import { db } from @/app/firebase";
import { db } from "../../firebase";
import Link from "next/link";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { ClerkProvider, isLoaded, isSignedIn, useUser } from "@clerk/nextjs";


function Deck({params}) {
    // access current user data
    const { isSignedIn, isLoaded, user } = useUser();
    const [flashcards, setFlashcards] = useState([
        // { front: "Singly-Linked List", back: "A data structure that orders a set of data elements, each containing a link to it's successor." },
        // { front: "Stack", back: "A data structure that orders a set of data elements that are placed first in and last out. A real life example is a pile of books; you add and remove a book from the top." }
    ])
    const [open, setOpen] = useState(false)
    const [newTitle, setNewTitle] = useState("")

    const findDeck = async (decodedDeckName) => {
        try {
            const userId = user.id;
            const docRef = doc(collection(db, "users", userId, "decks"), decodedDeckName);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists){
                throw new Error("document not found!")
            }
            setFlashcards(docSnap.data().cards);
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
    }, [isLoaded]);

    return (
        <main className={"w-screen h-full min-h-screen flex flex-col justify-center items-center space-y-[5rem]"}>
            {/* <Dialog open={open} onClose={setOpen} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                        >
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 flex flex-col justify-center items-center w-full space-y-[1rem]">
                                <label className="text-[30px] font-[500]">Create a new flashcard deck</label>
                                <input className="w-full p-[1rem] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg lue-500 block focus:outline-none"
                                    placeholder="Deck Title"
                                    name="title"
                                    id="deck-title"
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                />
                                <div className="flex flex-row justify-center items-center space-x-[1rem]">
                                    <button type="button" onClick={() => setOpen(false)} className="text-[#333] bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center transition ease-in-out duration-300">Cancel</button>
                                    <button type="submit" onClick={addNewDeck}className="text-white bg-[#4bacfc] hover:bg-[#4480f7] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center transition ease-in-out duration-300">Create new deck</button>
                                </div>
                            </div>

                        </DialogPanel>
                    </div>
                </div>
            </Dialog> */}

            <div className="p-[2rem] w-full flex flex-row justify-between items-center">
                <header className="absolute inset-x-0 top-0 z-50">
                    <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
                        <div className="flex lg:flex-1 flex-col justify-start items-start space-y-[0.5rem]">
                            <Link href="/" className="-m-1.5 p-1.5">
                                StudySwipe
                            </Link>
                            <h1 className="text-[38px] font-[500] tracking-[1.5px]">{params.deck}
                            </h1>
                        </div>

                        <div className="flex flex-row justify-center items-center space-x-[1.5rem]">
                            <FontAwesomeIcon icon={faCirclePlus} className="text-[2.5rem] cursor-pointer" onClick={()=>{console.log("button does not work!")}} />
                            <Dropdown label={"Menu"}>
                                <p className="block px-4 py-2 text-md font-semibold text-gray-700 border-b-[1px]">You are </p>
                                <Link href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="menu-item-0">Account settings</Link>
                                <form method="POST" action="#" role="none">
                                    <button type="submit" className="block w-full px-4 py-2 text-left text-sm text-gray-700" role="menuitem" tabIndex="-1" id="menu-item-3">Sign out</button>
                                </form>
                            </Dropdown>
                        </div>
                    </nav>
                </header>
            </div>
            <div className="flex flex-col justify-center items-center space-y-[2rem]">
                {flashcards.map((flashcard, index) =>
                    <Flashcard key={index} front={flashcard.front} back={flashcard.back} />
                )}
            </div>
        </main>
    )
}

export default function DeckWrapper({params}){
    return (
        <ClerkProvider>
            <Deck params={params}></Deck>
        </ClerkProvider>
    )
}