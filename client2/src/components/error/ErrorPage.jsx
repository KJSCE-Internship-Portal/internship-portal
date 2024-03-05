import React from 'react';

const ErrorPage = () => {
  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ color: '#dc3545' }}>Oops! Something went wrong.</h1>
        <p style={{ color: '#6c757d' }}>Either your account is disabled or Your Approval is Pending with the Mentor. Access will be Granted when you get Approval</p>
      </div>
    </div>
  );
};

export default ErrorPage;
