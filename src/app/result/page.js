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

      // if (router.query.session_id) {
        // setSession_id(router.query.session_id);

      // }
    // }, [router.query.session_id]);
    })

    useEffect(() => {
      const fetchCheckoutSession = async () => {
        if (!session_id) return;
        try {
          const res = await fetch(`/api/checkout?session_id=${session_id}`);
          const sessionData = await res.json();
          if (res.ok) {
            setSession(sessionData);
            if (sessionData.payment_status === 'paid') {
              await updateUserPlan('pro'); 
            }
          } else {
            setError(sessionData.error);
          }
        } catch (err) {
          setError('An error occurred while retrieving the session.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchCheckoutSession();
    }, [session_id]);
  
    const updateUserPlan = async (newPlan) => {
      if (isSignedIn && user) {
        const userDoc = doc(db, 'users', user.id);
        try {
          await setDoc(userDoc, { plan: newPlan }, { merge: true });
          console.log("User plan updated successfully");
          applyPlanLimits(newPlan); 
        } catch (error) {
          console.error("Error updating user plan:", error);
        }
      }
    };

    // I have no clue what we plan on doing based on the limits
    const applyPlanLimits = (plan) => {
      switch (plan) {
        case 'free':
          // Limited access ??
          break;
        case 'pro':
          // Full access ??
          break;
        default:
          
      }
    }

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