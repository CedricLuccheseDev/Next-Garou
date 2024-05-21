import { ReactNode } from "react";
import Image from 'next/image'

function Background(props: {
  children: ReactNode,
  className?: string,
}) {
  const {
    children,
    className,
  } = props;
  return (
    <div
      className={
        "flex flex-col items-center justify-center max-w-screen relative h-screen max-h-screen min-h-screen"
      }
    >
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
      <div className="flex-grow w-full flex flex-col p-24">
        {children}
      </div>
    </div>
  );
}

export default Background;
