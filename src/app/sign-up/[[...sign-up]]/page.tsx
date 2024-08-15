'use client'
import { SignUp } from "@clerk/nextjs";
import { ClerkProvider } from "@clerk/nextjs";
import React, { useEffect } from 'react'

export default function PageWrapper(){
  return (
    <ClerkProvider>
      <Page></Page>
    </ClerkProvider>
  )
}

function Page() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <SignUp
      path="/sign-up"
      />
    </div>
  )
}