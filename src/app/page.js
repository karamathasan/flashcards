import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={"w-screen h-full min-h-screen flex flex-col justify-start items-center"}>
      <h1 className="text-[50px] font-[500] tracking-[1.5px]">Welcome to Flashcard SaaS</h1>
    </main>
  );
}
