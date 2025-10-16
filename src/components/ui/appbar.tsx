import React from 'react';

export default function AppBar() {
  return (
    <header className='flex w-full items-center justify-center bg-white py-5 shadow-md'>
      <img
        src='/ecics.svg'
        alt='App Logo'
        className='h-12 object-contain py-1'
      />
    </header>
  );
}
