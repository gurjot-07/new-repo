import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Axios from 'axios';

const EmailVerificationPage = () => {
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await Axios.get(`/auth/verifyemail?${token}`);
        const data = response.data;
        console.log('inside frontend verify token - ', data);
        setVerificationStatus(data.message);
        if (data.message === 'Email verification successful. You can now login.') {
          setTimeout(() => navigate('/'), 4000);
        }
      } catch (error) {
        console.error('Error verifying email:', error.message);
        setVerificationStatus('An error occurred during email verification.');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div>
      {verificationStatus ? (
        <p>{verificationStatus}</p>
      ) : (
        <p>Verifying your email, please wait...</p>
      )}
    </div>
  );
};

export default EmailVerificationPage;