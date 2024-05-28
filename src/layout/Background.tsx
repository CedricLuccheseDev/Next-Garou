import Image from 'next/image'
import HomeParticles from "@/app/(ui)/particles";

function Background(props: {
}) {
  const {
  } = props;
  return (
    <div>
      <div className="overflow-hidden h-screen w-screen absolute">
        <div className="absolute h-[512px] w-[512px] -right-2 -top-8">
            <Image
              className="animate-appearance-in w-full"
              width={0}
              height={0}
              src="/bubble-background.png"
              layout="fill"
              objectFit="contain"
              alt="garou bg"
              objectPosition="right"
              quality={100} />
        </div>
      </div>
      <HomeParticles />
    </div>
  );
}

export default Background;
