import { Button } from "@nextui-org/react";
import Header from "./(ui)/Header";
import Wrapper from "./(ui)/Wrapper";

export default function Home() {
  return (
    <main className="flex-grow w-full flex flex-col items-center">
      <Header />
      <div className="h-screen"></div>
    </main>
  );
}
