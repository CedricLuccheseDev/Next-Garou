import Header from "@/src/layout/Header";
import Background from "../src/layout/Background";
import HomeParticles from "./(ui)/particles";
import Image from 'next/image'

export default function Home() {

  return (
    <div>
      <Background />
      <div className="flex flex-col p-4 space-y-4">
        <Header />
        <div className="flex flex-col p-16">
          <div className="font-medium text-8xl animate-fade">
            The next Werewolf Game
          </div>
          <div className="text-3xl opacity-80 px-4 animate-pulse">
            With AI procedural behaviors...
          </div>
        </div>


        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className="absolute w-full h-full flex items-center justify-center">
            <div className="hexagon w-full h-full flex items-center justify-center">
              <div className="hex-content text-center">Votre Texte Ici</div>
            </div>
          </div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-500 rounded-full"></div>
          <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-500 rounded-full"></div>
          <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-500 rounded-full"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-12 h-12 bg-blue-500 rounded-full"></div>
          <div className="absolute bottom-1/4 left-1/4 transform -translate-x-1/2 translate-y-1/2 w-12 h-12 bg-blue-500 rounded-full"></div>
        </div>

      </div>
    </div>
  );
}
