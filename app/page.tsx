import Background from "../src/layout/Background";

export default function Home() {
  return (
    <Background>
      <div className="flex flex-col space-y-2">
        <h1 className="font-medium text-8xl">
          The next Werewolf Game
        </h1>
        <div className="text-3xl opacity-80 px-4">
          With AI procedural behaviors...
        </div>
      </div>
    </Background>
  );
}
