'use client'
import { useEffect, useState } from "react";

import Dropdown from "../../components/dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft, faArrowCircleRight, faArrowLeft, faCirclePlus, faMagicWandSparkles, faShuffle } from "@fortawesome/free-solid-svg-icons";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { ThreeDot } from "react-loading-indicators";
// import { db } from @/app/firebase";
import { db } from "../../firebase";
import Link from "next/link";
import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { ClerkProvider, isLoaded, isSignedIn, SignOutButton, useUser } from "@clerk/nextjs";
import { FlashcardArray } from "react-quizlet-flashcard";

require('dotenv').config()

function Deck({ params }) {
    // access current user data
    const [isLoading, setIsLoading] = useState(false);
    const { isSignedIn, isLoaded, user } = useUser();
    const [flashcards, setFlashcards] = useState([])
    const [manualOpen, setOpen] = useState(false)
    const [aiOpen, setAIOpen] = useState(false)
    const [genUses, setGenUses] = useState(1)

    const [flashcardFront, setFront] = useState("")
    const [flashcardBack, setBack] = useState("")

    const [plan, setPlan] = useState("")
    
    const createNewFlashcard = () => {
        setFlashcards((flashcards) => [...flashcards, { front: flashcardFront, back: flashcardBack }])
        setFront("")
        setBack("")
        setOpen(false)
    }
    const updateDBFlashcards = async () => {
        const deckRef = doc(collection(db, 'users', user.id, 'decks'), decodeURIComponent(params.deck))
        const deckSnap = await getDoc(deckRef)
        await setDoc(deckRef, { ...deckSnap.data(), cards: flashcards })
    }
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
        if (isLoaded) {
            updateDBFlashcards()
        }
    }, [flashcards])
    
    useEffect(() => {
        const loadPlan = async ()=>{
            const userId = user.id;
            const docRef = doc(collection(db, "users"), userId);
            const docSnap = await getDoc(docRef);
            const data = docSnap.data()
            const customer_id = data.customer_id
            if (data.customer_id !== "none"){
                setPlan("pro")
            }
            const subscriberData = await fetch("/api/subscriber",
                {
                    method:"POST",
                    headers:{
                        'Content-Type': 'application/json',
                        origin:'http://localhost:3000' 
                    },
                    body:JSON.stringify(
                        {customer_id:customer_id}
                    )
                }
            )
            // subscriberData.json().then((data)=>{console.log(data)})
        }
        if (isLoaded && isSignedIn && user) {
            const decodedDeckName = decodeURIComponent(params.deck);
            findDeck(decodedDeckName);
            loadPlan()
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
    const [numFlashcards, setNumflashcards] = useState(1)

    // the purpose of this method is to make sure that the user cannot make more flashcards than the limit based on their plan
    const updateNumGeneratedFlashcards = async (target)=>{
        
        if (plan === "free"){
            setNumflashcards(Math.min(target, 10))
        } 
    }

    const [prompt, setPrompt] = useState("")
    const generateFlashcards = async () => {
        if (!prompt.trim()) return;

        setIsLoading(true);
        let API_URL = "https://api.openai.com/v1/chat/completions"
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " +  process.env.NEXT_PUBLIC_OPENAI_API_KEY,
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: "You are a helpful assistant that creates flashcards." },
                        {
                            role: "user", content: `Create ${numFlashcards} flashcards about ${prompt}. Format each flashcard as a JSON object formated as 
                            {
                                "front": string,
                                "back": string
                            }
                            place commas in between each json card and store in in an array. NEVER USE forward ticks and JSON inside of the response PLEASE`
                        }
                    ],
                    temperature: 1.0,
                }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to generate flashcards');
            }

            const data = await response.json();
            const generatedFlashcards = JSON.parse(data.choices[0].message.content);
            setFlashcards([...flashcards, ...generatedFlashcards])
            setAIOpen(false); setPrompt(""); setNumflashcards(1);
        } catch (error) {
            console.error('Error generating flashcards:', error);
        } finally {
            // Reset loading state to false after the operation completes
            setIsLoading(false);
        }
    };

    return (
        <main className={"w-screen h-full min-h-screen flex flex-col justify-center items-center space-y-[5rem]"}>
            <Dialog open={manualOpen} onClose={setOpen} className="relative z-10">
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

            <Dialog open={aiOpen} onClose={setAIOpen} className="relative z-10">
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
                            {/* ADD FLASHCARD WITH AI */}
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 flex flex-col justify-center items-center w-full space-y-[1rem]">
                                <label className="text-[30px] font-[500]">Create a new flashcard <span className="text-[10px]">with AI</span></label>
                                <input className="w-full p-[1rem] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg lue-500 block focus:outline-none"
                                    placeholder="Topic"
                                    name="topic"
                                    id="deck-topic"
                                    type="text"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                />
                                <input className="w-full p-[1rem] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg lue-500 block focus:outline-none"
                                    placeholder="quantity"
                                    name="quantity"
                                    id="number-of-cards"
                                    type="number"
                                    value={numFlashcards}
                                    onChange={(e) => updateNumGeneratedFlashcards(e.target.value)}
                                />
                                <div className="flex flex-row justify-center items-center space-x-[1rem]">
                                    <button type="button" onClick={() => setAIOpen(false)} className="text-[#333] bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center transition ease-in-out duration-300">Cancel</button>
                                    <button type="submit" onClick={generateFlashcards} className="text-white bg-[#4bacfc] hover:bg-[#4480f7] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center transition ease-in-out duration-300">Create new flashcards</button>
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
                            <h1 className="text-[38px] font-[500] tracking-[1.5px]">{decodeURI(params.deck)}
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
            {!isLoaded ?
                (<ThreeDot color="#4bacfc" size="medium" text="" textColor="" />)
                :
                (<>
                    <div className="flex flex-col justify-center items-center space-y-[2rem]">
                        {
                            flashcards.length > 0 ? (
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
                            ) : (
                                <h1 className="px-[1.5rem] w-full text-left text-[56px] font-[500] tracking-[1.2px]"> You have no cards in this deck . . . </h1>
                            )
                        }
                    </div>

                    <div className="flex flex-row justify-center items-center space-x-[2rem]">
                        <FontAwesomeIcon icon={faCirclePlus} className="text-[2.5rem] cursor-pointer" onClick={() => { setOpen(true) }} />
                        <FontAwesomeIcon icon={faMagicWandSparkles} className="text-[2.5rem] cursor-pointer" onClick={() => { setAIOpen(true) }} />
                    </div>

                    {
                        flashcards.length > 0 ? (
                            <div className="flex flex-col justify-center items-center space-y-[1rem] divide-y-2">
                            <h1 className="px-[1.5rem] w-full text-left text-[38px] font-[500] tracking-[1.2px]">Terms in this set <span className="text-[15px]">{flashcards.length} terms</span></h1>
                            {(flashcards.map((flashcard, index) =>
                                <div key={index} className="py-[1rem] px-[1.5rem] w-[90vw] sm:w-[80vw] md:w-[70vw] ">
                                    <h1 className="text-[30px] font-[500] tracking-[1px]">{flashcard.front}</h1>
                                    <p>{flashcard.back}</p>
                                </div>
                            ))}
                        </div>
                        ) : (
                            <></>
                        )
                    }


                </>)
            }
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