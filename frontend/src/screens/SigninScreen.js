import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useUserContext } from '../components/UserContext';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import registerimg from '../images/contact-img.png';

export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn, userInfo } = useUserContext();

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      signIn(parsedUserInfo.token);
    }
  }, [signIn]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post('/auth/login', {
        email,
        password,
      });

      // Use the signIn method from the context
      signIn(data);
      localStorage.setItem('userInfo', JSON.stringify(data));

      console.log('userInfo - ',data);
      navigate(redirect || '/');
      window.location.reload();
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <>
    <section className="contact_section layout_padding">
    <div className="container">
      <div className="row">
      <div className="col-md-6 d-none d-md-block">
            <div className="img-box">
             <img src={registerimg} alt="" />
            </div>
          </div>

        <div className="col-md-6">
          <div className="heading_container">
            <h2>Login to Your Account</h2>
          </div>
          <form onSubmit={submitHandler}>
            <div>
            <Form.Label>Email</Form.Label>
              <input 
              type="email" 
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
            <Form.Label>Password</Form.Label>
              <input 
              type="password" 
              placeholder="Password" 
              required
              onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div className="btn-box">
              <button type="submit">Login</button>
              </div>
              <hr/>
          </form>
          <div className="mb-3">
            New customer?{' '}
            <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
          </div>
          </div>

          
          
    </div>
      </div>
      


  </section>

    </>


  );
}
