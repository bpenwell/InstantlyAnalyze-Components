import React from 'react';

interface IComingSoonWrapper {
  text?: string;
  children: React.ReactNode;
}

export const ComingSoonWrapper = (props: IComingSoonWrapper) => {
  const { text = 'Coming soon!', children } = props;
  return (
    <div className="relative rounded-lg overflow-hidden">
      {children}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center text-white text-2xl font-bold z-10 rounded-lg">
        {text}
      </div>
    </div>
  );
};