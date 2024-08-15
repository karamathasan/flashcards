'use client'

import { ClerkProvider, SignIn } from "@clerk/nextjs";
import React from "react";
import { shadesOfPurple, dark, neobrutalism } from "@clerk/themes";
import { easeInOut, motion } from "framer-motion";

export default function Page() {
  return (
    <ClerkProvider>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 100, scale: 1 }}
          transition={{ ease: easeInOut, duration: 0.5 }}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <SignIn path="/sign-in" />
        </motion.div>
      </ClerkProvider>
  )

}