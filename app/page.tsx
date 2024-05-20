import Background from "../src/layout/Background";
import Wrapper from "../src/layout/Wrapper";

export default function Home() {
  return (
    <Background>
      <Wrapper className="py-4">
        <h1 className="font-bold text-5xl animate-pulse">The next wolf game generation</h1>
      </Wrapper>
    </Background>
  );
}
