import React from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import dynamic from "next/dynamic";

const SignIn = dynamic(() => import("@/app/signin/page"));

export default function Home() {
  return (
    <main className={"flex flex-column justify-center items-center p-24"}>
      <SignIn />
    </main>
  );
}
