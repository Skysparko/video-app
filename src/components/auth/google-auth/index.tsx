import React from 'react';

const GoogleAuth: React.FC = () => {
  const handleGoogleLogin = () => {
    // window.location.href = 'localhostauth/google';
  };

  return (
    <div>
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
};

export default GoogleAuth;
