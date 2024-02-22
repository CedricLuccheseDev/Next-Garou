import { ReactNode } from "react";
import Image from 'next/image'

function Background(props: {
  children: ReactNode,
  scrollable?: boolean,
  className?: string,
}) {
  const {
    children,
    scrollable = false,
    className,
  } = props;
  return (
    <div
      className={
        "flex flex-col items-center justify-center max-w-screen relative "
        + (scrollable ? "min-h-screen" : "h-screen max-h-screen min-h-screen items-center")
      }
    >

      <div className="overflow-hidden h-screen w-full absolute">
        <div className="absolute -top-64 h-[120vh] w-screen">
              <Image
                className="animate-appearance-in w-full h-auto"
                width={0}
                height={0}
                src="/bubble.svg"
                layout="fill"
                alt="garou bg"
                objectPosition="right"
                quality={100} />
          </div>
      </div>


      <div className="overflow-hidden h-screen w-full absolute">
        <div className="absolute  -right-64 -top-16 h-[120vh] w-full">
            <Image
              className="animate-appearance-in w-full h-auto"
              width={0}
              height={0}
              src="/garoubg.svg"
              layout="fill"
              objectFit="contain"
              alt="garou bg"
              objectPosition="right"
              quality={100} />
        </div>
      </div>

      <div className="flex-grow w-full flex flex-col items-center p-6">
        {children}
      </div>
    </div>
  );
}

export default Background;
