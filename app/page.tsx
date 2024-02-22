import Header from "./(ui)/Header";
import Wrapper from "./(ui)/Wrapper";

export default function Home() {
  return (
    <main>
      <Header />
      <Wrapper>
        a
      </Wrapper>
      <div className="grid grid-cols-2">
        <div className="bg-red-500">ok</div>
        <div>ok</div>
      </div>
    </main>
  );
}
