import Chat from './chat';
import InfosArea from './infosArea';
import PlayersArea from './playersArea';

export default function ContentBody() {
  return (
    <div className='flex flex-row space-x-8 w-full h-3/4 p-8'>
      <div className='w-80'>
        <InfosArea />
      </div>
      <Chat />
      <div className='w-80'>
        <PlayersArea />
      </div>
    </div>
  );
};