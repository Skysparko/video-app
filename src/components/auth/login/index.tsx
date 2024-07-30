import React, { useState } from 'react';
import { useAuth } from '../../../context/auth.context';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Login: React.FC = () => {
  const { login, googleLogin } = useAuth(); // Assume googleLogin is added to auth context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigate('/'); // Redirect to the home page or VideoRecorder after successful login
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    try {
      await googleLogin(response.credential); // Handle Google login token
      navigate('/'); // Redirect after successful login
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleGoogleError = (error: any) => {
    console.error('Google login error:', error);
  };

  const handleRegister = () => {
    navigate('/register'); // Redirect to the registration page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </div>
        <div className="flex items-center justify-between mt-6">
          <hr className="w-full border-gray-300" />
          <span className="text-gray-500 px-4">or</span>
          <hr className="w-full border-gray-300" />
        </div>
        <div className="mt-6">
          <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID"> {/* Replace with your Google client ID */}
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              // onError={handleGoogleError}
              useOneTap
              // className="w-full"
            />
          </GoogleOAuthProvider>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={handleRegister}
            className="w-full bg-gray-500 text-white py-2 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
