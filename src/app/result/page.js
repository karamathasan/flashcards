'use client'
import { useEffect, useState } from "react";
import { db } from "../firebase";
import Link from "next/link";
import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { ClerkProvider, isLoaded, isSignedIn, useUser, SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Router, useSearchParams } from "react-router-dom";
import { useRouter } from "next/navigation";

export default function CheckoutWrapper({params}){
  return (
    <ClerkProvider>
      <Checkout params={params}/> 
    </ClerkProvider>
  )
}

//TODO: upon completion of filling in payment details and subscriptions:
/**
 * 1. the user can now generate an unlimited number of flashcards for a topic
 * 2. 
 */
// these mean that this file should contain the following
/**
 * 1. A Thank you message
 * 2. A return
 * 3. A reassignment to the user's db plan field
 * 4. the plan to expire after a month
 */

function Checkout(){
  const [session_id, setSession_id] = useState()

  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [error, setError] = useState(null)

  const { isSignedIn, isLoaded, user } = useUser();

  const updateUserPlan = async(subscriber_id)=>{
    if (isSignedIn){
      const userDoc = doc(collection(db,'users'), user.id)
      const userSnap = await getDoc(userDoc)
      if (userSnap.exists()){
        try{
          await setDoc(userDoc, {...userSnap.data(),subscriber_id:subscriber_id})
          console.log("user successfully added to database")
        }
        catch (error){
          console.error(error)
        }
      } else {
        console.log("userSnap does not exist")
      }
    } else {
      console.log("not signed in")
    }
  }

  useEffect(()=>{
    if (isSignedIn){
      const link = location.href.split("=")[1]
      setSession_id(link)
    }
  }, isSignedIn)

  useEffect(() => {
    if (isSignedIn) {
      const fetchCheckoutSession = async () => {
        if (!session_id) {
          return
        }
        try {
          const res = await fetch(`/api/checkout?session_id=${session_id}`)
          const sessionData = await res.json()
          if (res.ok) {
            if (sessionData.subscription){
              await updateUserPlan(sessionData.subscription)
            } else {
              console.log("an issue occured when retrieving subscription id")
            }
            setSession(sessionData)
          } else {
            setError(sessionData.error)
          }
        } catch (err) {
          setError('An error occurred while retrieving the session.')
        } finally {
          setLoading(false)
        }
      }
      fetchCheckoutSession()
    }
  }, session_id)

  useEffect(()=>{
    if (session){
      setLoading(false)
    }
  },[session])

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
          {!loading ? (
            session ? (
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Thank You!
                </h1>  
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Link
                    href="/decks"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Get started
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  An error occured. . .
                </h1>  
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Link
                    href="/"
                    className="rounded-md bg-gray-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    back to home
                  </Link>
                </div>
            </div>
            )
            ) : (
              <></>
            )}

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
  </main>
  )
}