'use client'

import { SignUp } from "@clerk/nextjs";
import { ClerkProvider } from "@clerk/nextjs";
import { light } from "@clerk/themes";
import { easeInOut, motion } from "framer-motion";


import React from 'react'

export default function PageWrapper(){
  return (
    <ClerkProvider>
      <Page></Page>
    </ClerkProvider>
  )
}

function Page() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 100, scale: 1 }}
      transition={{ ease: easeInOut, duration: 0.5 }}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <SignUp path="/sign-up" />
    </motion.div>
  )
}