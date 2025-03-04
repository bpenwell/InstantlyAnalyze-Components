import React from 'react';


interface IComingSoonWrapper {
  text?: string;
  children: any;
};
export const ComingSoonWrapper = (props: IComingSoonWrapper) => {
  const { text = 'Coming soon!', children } = props;
  return (
    <div style={{ position: 'relative' }}>
      {children}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: '#fff',
          fontSize: '2rem',
          fontWeight: 'bold',
          zIndex: 10,
        }}
      >
        {text}
      </div>
    </div>
  );
};