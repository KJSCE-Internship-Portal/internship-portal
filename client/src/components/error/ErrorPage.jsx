import React from 'react';

const ErrorPage = () => {
  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'green', fontSize: '3rem', fontWeight: 'bold' }}>Your account is currently awaiting approval.</h1>
        <p style={{ color: '#6c757d', fontSize: '1.5rem' }}>Please note that access will be granted once your mentor assignment is confirmed.</p>
      </div>
    </div>
  );
};

export default ErrorPage;