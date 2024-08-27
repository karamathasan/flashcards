'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation";

import DeckCard from "../components/deck";
import Dropdown from "../components/dropdown";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

import { db } from "../firebase";
import { doc, collection, getDoc, setDoc, getDocs, query } from "firebase/firestore";

import { ClerkProvider, useUser } from "@clerk/nextjs";

function Decks() {
    const router = useRouter()
    const { isSignedIn, isLoaded, user } = useUser();

    const [open, setOpen] = useState(false)
    const [newTitle, setNewTitle] = useState("")

    const [decks, setDecks] = useState([])

    const addNewDeck = async ()=>{
        setDecks([...decks,{title:newTitle}])
        
        const deckRef = doc(collection(db,'users',user.id,'decks'), newTitle)
        await setDoc(deckRef, {cards:[]})
    }

    const updateDecks = async ()=>{
        const userRef = doc(collection(db, 'users'), user.id)
        const userSnap = await getDoc(userRef)
        if (!userSnap.exists()){
            throw new Error("user not found in database!")
        }
        const docs = await getDocs(query(collection(db, 'users', user.id, 'decks')))
        const decksArr = []
        docs.forEach((doc)=>{
            decksArr.push({
                id: doc.id,
                ...doc.data()
            })
        })
        setDecks(decksArr)
    }

    useEffect(()=>{
        if (isLoaded){
            updateDecks()
        }
    },[isLoaded])

    return (
        <main className={"w-screen h-full min-h-screen flex flex-col justify-start items-center"}>
            <Dialog open={open} onClose={setOpen} className="relative z-10">
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
            </Dialog>

            <div className="p-[2rem] w-full flex flex-row justify-between items-center">
                <header className="absolute inset-x-0 top-0 z-50">
                    <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
                        <div className="flex lg:flex-1 flex-col justify-start items-start space-y-[0.5rem]">
                            <Link href="/" className="-m-1.5 p-1.5">
                                StudySwipe
                            </Link>
                            <h1 className="text-[38px] font-[500] tracking-[1.5px]">Your Decks {/* display the user's name */}
                                <span className="text-[20px]">{decks.length} Flashcard Deck{(decks.length > 1) ? "s" : ""}</span> {/* insert the number of flashcards a user has */}
                            </h1>
                        </div>
                        <div className="flex flex-row justify-center items-center space-x-[1.5rem]">
                            <FontAwesomeIcon icon={faCirclePlus} className="text-[2.5rem] cursor-pointer" onClick={() => setOpen(true)} />
                            <Dropdown label={"Menu"}>
                                <p className="block px-4 py-2 text-md font-semibold text-gray-700 border-b-[1px]">You are</p>
                                <Link href="/user-profile" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="menu-item-0">Account settings</Link>
                                <form method="POST" action="#" role="none">
                                    <button type="submit" className="block w-full px-4 py-2 text-left text-sm text-gray-700" role="menuitem" tabIndex="-1" id="menu-item-3">Sign out</button>
                                </form>
                            </Dropdown>
                        </div>
                    </nav>
                </header>
            </div>

            <div className="mt-[5rem] flex flex-col justify-center items-center gap-[1rem]">
                {isLoaded ? (
                    decks.length > 0 ? (
                        decks.map((deck, index) => {
                            return (<DeckCard key={index} title={deck.id} numCards={deck.length} />)
                        })
                    ) : (
                        <> You have no decks </>
                    )
                ) : (<>loading decks. . .</>)}
            </div>
        </main>
    );
}

export default function DecksWrapper(){
    return (
        <ClerkProvider>
            <Decks></Decks>
        </ClerkProvider>
    )
}
