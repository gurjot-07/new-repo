import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import registerimg from '../images/contact-img.png';


export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [isChecked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    setChecked(!isChecked);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const { data } = await Axios.post('/auth/signup', {
        firstname: firstname,
        lastname: lastname,
        email,
        password,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      const response = await Axios.post('http://localhost:4000/auth/google');

      console.log('Response from /auth/google:', response.data);
    } catch (error) {
      console.error('Error signing in with Google:', error.message);
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
        <div className="col-md-6">
          <div className="heading_container">
            <h2>Create Your Account</h2>
          </div>
          <form onSubmit={submitHandler}>
            <div>
            <Form.Label>First Name</Form.Label>
              <input 
              type="text" 
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div>
            <Form.Label>Last Name</Form.Label>
              <input 
              type="text" 
              placeholder="Last Name"
              onChange={(e) => setLastName(e.target.value)}/>
            </div>
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
            <div>
            <Form.Label>Confirm Password</Form.Label>
              <input 
              type="password" 
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              />
            </div>
            <div>
  <input
    type="checkbox"
    checked={isChecked}
    onChange={handleCheckboxChange}
    style={{ width: '16px', height: '16px', marginRight: '8px' }}
  />
  <label>
    Agree to the <Link to='#'>Terms & Conditions</Link>
  </label>
</div>
            <div className="btn-box">
  <button
    type="submit"
    disabled={!isChecked}
    style={{
      backgroundColor: isChecked ? '#2e775f' : '#44b89d',
      borderColor: isChecked ? '#2e775f' : '#44b89d',
      color: '#ffffff',
      display: 'inline-block',
      padding: '12px 45px',
      borderRadius: '45px',
      border: '1px solid',
      transition: 'all 0.3s',
      width: '100%',
    }}
  >
    Register
  </button>
</div>
<hr/>
          </form>
      </div>
        <div className="col-md-6 d-none d-md-block">
          <div className="img-box">
            <img src={registerimg} alt="" />
          </div>
        </div>
      </div>
      
      <div className="mb-3">
          Already have an account?{' '}
          <Link to={`/signin?redirect=${redirect}`}>Log In</Link>
        </div>

        <div className="mb-3">
          Register with {' '}
          <Link to='#' onClick={handleSignInWithGoogle}>Google</Link>
        </div>
    </div>

  </section>
    </>
  );
}
