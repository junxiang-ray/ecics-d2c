import { Button } from 'antd';
import Image from 'next/image';

export default function Home() {
  const test = () => {
    console.log('test');
  };
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='flex h-full w-full flex-col items-center justify-center'>
        <Image src='/ecics-50-years.svg' alt='Logo' width={260} height={260} />
        <h1 className='text-3xl font-bold'>Welcome to the ECICS</h1>
        <Button className='bg-slate-50 p-4 px-2'>Button</Button>
        <Button className='bg-slate-50 p-4 px-2' onClick={test}>
          <a href='/api/configs'>API Configs</a>
        </Button>
      </div>
    </main>
  );
}
