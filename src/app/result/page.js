'use client'
import { use, useEffect, useState } from "react";
import { db } from "../firebase";
import Link from "next/link";
import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { ClerkProvider, isLoaded, isSignedIn, useUser } from "@clerk/nextjs";

import { Router, useSearchParams } from "react-router-dom";
import { useRouter } from "next/navigation";

export default function CheckoutWrapper({params}){
  return (
    <ClerkProvider>
      <Checkout params={params}/> 
    </ClerkProvider>
  )
}

function Checkout({params}){
    const router = useRouter()
    //TODO: get the session id, likely 
    // const searchParams = useSearchParams()
    // const session_id = searchParams.get('session_id')
    const [session_id, setSession_id] = useState()

    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const [error, setError] = useState(null)

    const { isSignedIn, isLoaded, user } = useUser();

    useEffect(()=>{
      // setSession_id()
    })

    // useEffect(() => {
    //     const fetchCheckoutSession = async () => {
    //       if (!session_id) return
    //       try {
    //         const res = await fetch(`/api/checkout_sessions?session_id=${session_id}`)
    //         const sessionData = await res.json()
    //         if (res.ok) {
    //           setSession(sessionData)
    //         } else {
    //           setError(sessionData.error)
    //         }
    //       } catch (err) {
    //         setError('An error occurred while retrieving the session.')
    //       } finally {
    //         setLoading(false)
    //       }
    //     }
    //     fetchCheckoutSession()
    //   }, [session_id])

      return (<> test </>)

      return (
        <>
        test
          {session.payment_status === 'paid' ? (
            <>
            <h4>
              success!
            </h4>
              {/* <Typography variant="h4">Thank you for your purchase!</Typography>
              <Box sx={{mt: 2}}>
                <Typography variant="h6">Session ID: {session_id}</Typography>
                <Typography variant="body1">
                  We have received your payment. You will receive an email with the
                  order details shortly.
                </Typography>
              </Box> */}
            </>
          ) : (
            <>
            error
              {/* <Typography variant="h4">Payment failed</Typography>
              <Box sx={{mt: 2}}>
                <Typography variant="body1">
                  Your payment was not successful. Please try again.
                </Typography>
              </Box> */}
            </>
          )}
        </>
        )

}