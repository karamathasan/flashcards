'use client'
import { useEffect, useState } from "react";

import Dropdown from "../../components/dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft, faArrowCircleRight, faArrowLeft, faCirclePlus, faShuffle } from "@fortawesome/free-solid-svg-icons";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

// import { db } from @/app/firebase";
import { db } from "../../firebase";
import Link from "next/link";
import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { ClerkProvider, isLoaded, isSignedIn, SignOutButton, useUser } from "@clerk/nextjs";
import { FlashcardArray } from "react-quizlet-flashcard";

const dumby = [
    {
        id: 1,
        frontHTML: <div className="text-[35px] w-full h-full flex justify-center items-center">What is the capital of&nbsp;<u>Alaska</u>?</div>,
        backHTML: <div className="text-[18px] w-full h-full flex justify-center items-center">Juneau</div>,
    },
    {
        id: 2,
        frontHTML: <>What is the capital of California?</>,
        backHTML: <>Sacramento</>,
    },
    {
        id: 3,
        frontHTML: <>What is the capital of New York?</>,
        backHTML: <>Albany</>,
    },
    {
        id: 4,
        frontHTML: <>What is the capital of Florida?</>,
        backHTML: <>Tallahassee</>,
    },
    {
        id: 5,
        frontHTML: <>What is the capital of Texas?</>,
        backHTML: <>Austin</>,
    },
    {
        id: 6,
        frontHTML: <>What is the capital of New Mexico?</>,
        backHTML: <>Santa Fe</>,
    },
    {
        id: 7,
        frontHTML: <>What is the capital of Arizona?</>,
        backHTML: <>Phoenix</>,
    },
]

function Deck({ params }) {
    // access current user data
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { isSignedIn, isLoaded, user } = useUser();
    const [flashcards, setFlashcards] = useState([
        // { id: 1, front: "Singly-Linked List", back: "A data structure that orders a set of data elements, each containing a link to it's successor." },
        // { id: 2, front: "Stack", back: "A data structure that orders a set of data elements that are placed first in and last out. A real life example is a pile of books; you add and remove a book from the top." }
    ])
    const [open, setOpen] = useState(false)
    const [flashcardFront, setFront] = useState("")
    const [flashcardBack, setBack] = useState("")
    const [htmlFlashcards, setHtmlFlashcards] = useState([])

    const createNewFlashcard = () => {
        setFlashcards((flashcards) => [...flashcards, { front: flashcardFront, back: flashcardBack }])
    }

    const updateDBFlashcards = async () => {
        const deckRef = doc(collection(db, 'users', user.id, 'decks'), decodeURIComponent(params.deck))
        const deckSnap = await getDoc(deckRef)
        await setDoc(deckRef, { ...deckSnap.data(), cards: flashcards })
    }

    useEffect(() => {
        if (isLoaded) {
            updateDBFlashcards()
        }
    }, [flashcards])

    const findDeck = async (decodedDeckName) => {
        try {
            const userId = user.id;
            const docRef = doc(collection(db, "users", userId, "decks"), decodedDeckName);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists) {
                throw new Error("document not found!")
            }
            setFlashcards(docSnap.data().cards);

        } catch (e) {
            console.error("Error fetching flashcards:", e);
        }
    };
    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            const decodedDeckName = decodeURIComponent(params.deck);
            findDeck(decodedDeckName);
        }
    }, [isLoaded]);

    // if user wants a specific amount of cards
    const handleCardCountChange = (e) => {
        setCardCount(Number(e.target.value)); // Convert input to number
    };

    // if user wants a specific prompt
    const handlePromptChange = (e) => {
        setPrompt(e.target.value); // Updates the prompt state
    };

    // generate user flashcards
    const generateFlashcards = async () => {
        if (!prompt.trim()) return;


        setIsLoading(true);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "You are a helpful assistant that creates flashcards." },
                        { role: "user", content: `Create ${numFlashcards} flashcards about ${prompt}. Format each flashcard as a JSON object with 'question' and 'answer' fields.` }
                    ],
                    temperature: 1.0,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate flashcards');
            }

            const data = await response.json();
            const generatedFlashcards = JSON.parse(data.choices[0].message.content);
            setFlashcards(generatedFlashcards);
        } catch (error) {
            console.error('Error generating flashcards:', error);
            setFlashcards(defaultFlashcards);
        } finally {
            // Reset loading state to false after the operation completes
            setIsLoading(false);
        }
    };

    return (
        <main className={"w-screen h-full min-h-screen flex flex-col justify-center items-center space-y-[5rem]"}>
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
                            {/* ADD FLASHCARD MANUALLY */}
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 flex flex-col justify-center items-center w-full space-y-[1rem]">
                                <label className="text-[30px] font-[500]">Create a new flashcard</label>
                                <input className="w-full p-[1rem] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg lue-500 block focus:outline-none"
                                    placeholder="Flashcard Front"
                                    name="title"
                                    id="deck-title"
                                    type="text"
                                    value={flashcardFront}
                                    onChange={(e) => setFront(e.target.value)}
                                />
                                <input className="w-full p-[1rem] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg lue-500 block focus:outline-none"
                                    placeholder="Flashcard Back"
                                    name="title"
                                    id="deck-title"
                                    type="text"
                                    value={flashcardBack}
                                    onChange={(e) => setBack(e.target.value)}
                                />
                                <div className="flex flex-row justify-center items-center space-x-[1rem]">
                                    <button type="button" onClick={() => setOpen(false)} className="text-[#333] bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center transition ease-in-out duration-300">Cancel</button>
                                    <button type="submit" onClick={createNewFlashcard} className="text-white bg-[#4bacfc] hover:bg-[#4480f7] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center transition ease-in-out duration-300">Create new flashcard</button>
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
                            <h1 className="text-[38px] font-[500] tracking-[1.5px]">{decodeURIComponent(params.deck)}
                            </h1>
                        </div>

                        <div className="flex flex-row justify-center items-center space-x-[1.5rem]">
                            <Dropdown label={"Menu"}>
                                {/* the email doesnt fit the box its in */}
                                <p className="block px-4 py-2 text-md font-semibold text-gray-700 border-b-[1px]">You are {isLoaded ? user.primaryEmailAddress.emailAddress : ". . ."} </p>
                                <Link href="/user-profile" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="menu-item-0">Account settings</Link>
                                <SignOutButton>
                                    <button type="submit" className="block w-full px-4 py-2 text-left text-sm text-gray-700" role="menuitem" tabIndex="-1" id="menu-item-3">Sign out</button>
                                </SignOutButton>
                            </Dropdown>
                        </div>
                    </nav>
                </header>
            </div>
            <div className="flex flex-col justify-center items-center space-y-[2rem]">
                {!isLoaded ? (<> loading </>) :
                    <FlashcardArray
                        cards={flashcards.map((e, index) => {
                            return (
                                {
                                    id: index,
                                    frontHTML: <h1 className="text-[35px] w-full h-full flex justify-center items-center text-center px-[1rem]">{e.front}</h1>,
                                    backHTML: <h1 className="text-[18px] w-full h-full flex justify-center items-center text-center px-[1rem]">{e.back}</h1>
                                }
                            )
                        })}
                    />
                }

            </div>
            <FontAwesomeIcon icon={faCirclePlus} className="text-[2.5rem] cursor-pointer" onClick={() => { setOpen(true) }} />

            <div className="flex flex-col justify-center items-center space-y-[1rem] divide-y-2">
                <h1 className="px-[1.5rem] w-full text-left text-[38px] font-[500] tracking-[1.2px]">Terms in this set <span className="text-[15px]">{2} terms</span></h1>
                {!isLoaded ? (<>loading </>) :
                    (flashcards.map((flashcard, index) =>
                        <div key={index} className="py-[1rem] px-[1.5rem] w-[90vw] sm:w-[80vw] md:w-[70vw] ">
                            <h1 className="text-[30px] font-[500] tracking-[1px]">{flashcard.front}</h1>
                            <p>{flashcard.back}</p>
                        </div>
                    ))}
            </div>
        </main>
    )
}

export default function DeckWrapper({ params }) {
    return (
        <ClerkProvider>
            <Deck params={params}></Deck>
        </ClerkProvider>
    )
}