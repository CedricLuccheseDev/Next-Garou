import HomeParticles from '@/app/(ui)/Particles';
import Image from 'next/image'
import CHeader from './CHeader';
import { Button } from '@/components/ui/button';

export default function LandingOnboard() {
  return (
    <section className='w-screen h-screen bg-gradient-to-b from-background to-[#070721]'>
      <div className='container py-2 px-8 mx-auto'>
        <HomeParticles />
        <div className='w-full h-full flex flex-col space-y-2'>
          <CHeader />
          <div className="flex flex-row p-16 items-center">
            <div className="flex flex-col h-full space-y-8 w-full">
              <div className="font-unbounded-bold font-medium text-6xl animate-fade">
                Play the next AI Werewolf Game
              </div>
              <div className="font-mulish-regular text-3xl opacity-80">
                Next-Garou is a revisited werewolf game. Play online with AI bots that have consciousness...
              </div>
            </div>
            <div className='flex justify-center items-center w-full'>
              <Image
                className="animate-appearance-in w-128 h-128"
                src="/bubble-background.png"
                width={600}
                height={600}
                alt="bubble"
                quality={100}
              />
            </div>
          </div>
          <div className='flex flex-row justify-center items-center w-full'>
            <Button variant="default" size="lg" className='font-unbounded-bold'>Play now</Button>
          </div>
        </div>
      </div>
    </section>

  );
}
