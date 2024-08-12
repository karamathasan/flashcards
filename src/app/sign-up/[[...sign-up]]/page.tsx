import { SignUp } from "@clerk/nextjs";
import { shadesOfPurple,neobrutalism } from "@clerk/themes";
import React from 'react'

export default function Page() {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <SignUp
    appearance={{
      baseTheme: [shadesOfPurple,neobrutalism]
    }}
    path="/sign-up"
  />;
  </div>
}