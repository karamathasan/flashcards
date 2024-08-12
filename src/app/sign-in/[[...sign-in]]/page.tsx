import { SignIn } from "@clerk/nextjs";
import React from "react";
import { shadesOfPurple,dark,neobrutalism } from "@clerk/themes";

export default function Page() {

    return  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <SignIn
    appearance={{
      baseTheme: [shadesOfPurple,neobrutalism],
    }}
    path="/sign-in"
  />;
  </div>
}