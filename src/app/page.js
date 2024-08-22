'use client'

import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faBars, faX } from "@fortawesome/free-solid-svg-icons";
import { DialogPanel, Dialog } from "@headlessui/react";
import { ClerkProvider, SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";

import { db } from "./firebase"
import { doc, getDoc, setDoc, collection} from "firebase/firestore";
import { useUser } from "@clerk/nextjs";

// import { getStripe } from "../utils/get-stripe"
import getStripe from "../utils/get-stripe"

const includedFeatures = [
  'Private forum access',
  'Member resources',
  'Entry to annual conference',
  'Official member t-shirt',
]

function Home() {
  const router = useRouter()
  const {isSignedIn, user} = useUser()

  const checkoutRedirect = async () => {
    const checkoutSession = await fetch('/api/checkout', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    })
    const checkoutSessionJson = await checkoutSession.json()
  
    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
  
    if (error) {
      console.warn(error.message)
    }
  }
  
  const addUser = async()=>{
    if (isSignedIn){
      const userDoc = doc(collection(db,'users'), user.id)
      const userSnap = await getDoc(userDoc)

      if (!userSnap.exists()){
        try{
          await setDoc(userDoc, {plan:"free"})
          console.log("user successfully added to database")
        }
        catch (error){
          console.error(error)
        }
      } 
    }
  }
 
  useEffect(()=>{
    addUser()
  }, [isSignedIn])

  return (
    <main className={"w-screen h-full min-h-screen flex flex-col justify-start items-center "}>
      <div>
        <header className="absolute inset-x-0 top-0 z-50">
          <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
            <div className="flex lg:flex-1">
              <Link href="/" className="-m-1.5 p-1.5">
                StudySwipe
              </Link>
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <SignedIn>
                <SignOutButton>
                  <Link href="" className="text-sm font-semibold leading-6 text-gray-900">
                    Log out <span aria-hidden="true">&rarr;</span>
                  </Link>
                </SignOutButton>
              </SignedIn>

              <SignedOut>
                <Link href="/sign-in" className="text-sm font-semibold leading-6 text-gray-900">
                  Sign In <span aria-hidden="true">&rarr;</span>
                </Link>
              </SignedOut>
            </div>
          </nav>
        </header>

        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">

            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Flashcards powered with AI
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Merging the power of AI to enhance student's experiences with flashcards
              </p>
              <SignedOut>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Link
                    href="/sign-in"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Get started
                  </Link>
                </div>
              </SignedOut>
              <SignedIn>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                  <a
                    href="/decks"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Your Decks
                  </a>
                </div>
              </SignedIn>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white py-24 sm:py-32" id="plans">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Simple no-tricks pricing</h2>
          </div>
          <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
            <div className="p-8 sm:p-10 lg:flex-auto">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">Premium Membership</h3>
              <p className="mt-6 text-base leading-7 text-gray-600">
                Lorem ipsum dolor sit amet consect etur adipisicing elit. Itaque amet indis perferendis blanditiis
                repellendus etur quidem assumenda.
              </p>
              <div className="mt-10 flex items-center gap-x-4">
                <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">What’s included</h4>
                <div className="h-px flex-auto bg-gray-100" />
              </div>
              <ul
                role="list"
                className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
              >
                <li className="flex gap-x-3">
                  <FontAwesomeIcon icon={faCheck} aria-hidden="true" className="h-6 w-5 flex-none text-indigo-600" />
                  hi
                </li>
              </ul>

            </div>
            <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
              <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                <div className="mx-auto max-w-xs px-8">
                  <p className="text-base font-semibold text-gray-600">Pay monthly</p>
                  <p className="mt-6 flex items-baseline justify-center gap-x-2">
                    <span className="text-5xl font-bold tracking-tight text-gray-900">$5<span className="text-lg tracking-lighter font-semibold">/month</span></span>
                    <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">USD</span>
                  </p>
                  <SignedIn>
                    <button
                      // href="/checkout"
                      onClick={checkoutRedirect}
                      className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Get access
                    </button>
                  </SignedIn>

                  <SignedOut>
                    <Link
                      href="/sign-up"
                      className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Get access
                    </Link>
                  </SignedOut>
                  <p className="mt-6 text-xs leading-5 text-gray-600">
                    Invoices and receipts available for easy company reimbursement
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none" id="plans">
            <div className="p-8 sm:p-10 lg:flex-auto">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">Free Membership</h3>
              <p className="mt-6 text-base leading-7 text-gray-600">
                Lorem ipsum dolor sit amet consect etur adipisicing elit. Itaque amet indis perferendis blanditiis
                repellendus etur quidem assumenda.
              </p>
              <div className="mt-10 flex items-center gap-x-4">
                <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">What’s included</h4>
                <div className="h-px flex-auto bg-gray-100" />
              </div>
              <ul
                role="list"
                className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
              >
                <li className="flex gap-x-3">
                  <FontAwesomeIcon icon={faCheck} aria-hidden="true" className="h-6 w-5 flex-none text-indigo-600" />
                  hi
                </li>
              </ul>

              <div className="mt-10 flex items-center gap-x-4">
                <h4 className="flex-none text-sm font-semibold leading-6 text-[#ea6161]">What’s not included</h4>
                <div className="h-px flex-auto bg-gray-100" />
              </div>
              <li className="flex gap-x-3">
                <FontAwesomeIcon icon={faX} aria-hidden="true" className="h-6 w-5 flex-none text-[#ea6161]" />
                ur mom lalala
              </li>

            </div>
            <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
              <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                <div className="mx-auto max-w-xs px-8">
                  <p className="text-base font-semibold text-gray-600">Free</p>
                  <p className="mt-6 flex items-baseline justify-center gap-x-2">
                    <span className="text-5xl font-bold tracking-tight text-gray-900">$0</span>
                    <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">USD</span>
                  </p>
                    <Link
                      href="/sign-up"
                      className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Get access
                    </Link>
                  <p className="mt-6 text-xs leading-5 text-gray-600">
                    Invoices and receipts available for easy company reimbursement
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

export default function HomeWrapper(){
  return (
    <ClerkProvider>
      <Home></Home>
    </ClerkProvider>
  )
}