import Background from "../src/layout/Background";
import HomeParticles from "./(ui)/particles";

export default function Home() {

  return (
    <Background>
      <HomeParticles />
      <div className="flex flex-col space-y-2">
        <div className="font-medium text-8xl">
          The next Werewolf Game
        </div>
        <div className="text-3xl opacity-80 px-4 animate-pulse">
          With AI procedural behaviors...
        </div>
      </div>
    </Background>
  );
}
