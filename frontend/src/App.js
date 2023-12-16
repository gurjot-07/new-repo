import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';

import BooklistCreateScreen from './screens/BooklistCreateScreen';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import SignupScreen from './screens/SignupScreen';
import ViewBookDetails from './screens/ViewBookDetails';
import { UserProvider } from '../src/components/UserContext';
import WishlistScreen from '../src/screens/WishlistScreen';
import BooklistScreen from '../src/screens/MyBooklistScreen';
import PublicBooklistsScreen from '../src/screens/PublicBooklistsScreen';
import AdminDashboard from '../src/screens/AdminDashboard';
import EmailVerificationPage from '../src/components/EmailVerificationPage';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { fullBox, cart, userInfo } = state;
 
  

  const signoutHandler = () => {

    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.reload();
  };

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  
  return (
    <UserProvider>
      <BrowserRouter>
        <div
          className={
            sidebarIsOpen
              ? fullBox
                ? 'site-container active-cont d-flex flex-column full-box'
                : 'site-container active-cont d-flex flex-column'
              : fullBox
              ? 'site-container d-flex flex-column full-box'
              : 'site-container d-flex flex-column'
          }
        >
          <ToastContainer position="bottom-center" limit={1} />
          <header>
            <Navbar bg="light" variant="light" expand="lg" id ="navbar">
              <Container>
              
                <LinkContainer to="/">
                  <Navbar.Brand>!acon</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="me-auto w-100 justify-content-end">
                    
                  
                  
                    <Link to="/publicbooklists" className="nav-link">
                      Public Booklists
                    </Link>

                    {userInfo &&  ( userInfo.user.role === 'admin' || userInfo.user.role === 'user' ) && (
                      <Link to="/mybooklists" className="nav-link">
                        My Booklists
                      </Link>
                    )}

                    

                    {userInfo &&  ( userInfo.user.role === 'admin' || userInfo.user.role === 'user' ) && (
                      <Link to="/cart" className="nav-link">
                        Cart
                        {cart.cartItems.length > 0 && (
                          <Badge pill bg="danger">
                            {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                          </Badge>
                        )}
                      </Link>
                    )}

                    {userInfo ? (
                      <NavDropdown title={userInfo.user.firstname} id="basic-nav-dropdown">
                        {userInfo && userInfo.user.role === 'admin' && (
                      <Link to="/admindashboard" className="dropdown-item">
                        Admin Dashboard
                      </Link>
                    )}
                        <Link
                          className="dropdown-item">
                          Account Information
                        </Link>
                        {userInfo &&  ( userInfo.user.role === 'admin' || userInfo.user.role === 'user' ) && (
                      <Link to="/wishlist" className="dropdown-item">
                        Wishlist
                      </Link>
                        )}
                        <Link
                          className="dropdown-item"
                          >
                          Settings
                        </Link>
                        <Link
                          className="dropdown-item"
                          to="#signout"
                          onClick={signoutHandler}>
                          Log Out
                        </Link>
                      </NavDropdown>
                    ) : (
                      <Link className="nav-link" to="/signin">
                        Log In
                      </Link>
                    )}
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
          </header>
          <main>
              <Routes>
                <Route path="/cart" element={<CartScreen />} />
                <Route path="/wishlist" element={<WishlistScreen />} />
                <Route path="/mybooklists" element={<BooklistScreen />} />
                <Route path="/mybooklists/create" element={<BooklistCreateScreen />} />
                <Route path="/publicbooklists" element={<PublicBooklistsScreen />} />
                <Route path="/admindashboard" element={<AdminDashboard />} />
                <Route path="/:bookId" element={<ViewBookDetails />} />
                <Route path="/" element={<HomeScreen />} />
                <Route path="/signup" element={<SignupScreen />} />
                <Route path="/signin" element={<SigninScreen />} />
                <Route path="/auth/verifyemail/:token" element={<EmailVerificationPage />} />
              </Routes>
          </main>
          <footer class="footer bg-light text-dark pt-4">
  <div class="container">
    <div class="row">
      <div class="col-md-3 col-6 mb-3">
        <h5>Help</h5>
        <ul class="list-unstyled">
          <li><a href="#" class="text-dark">Black Friday Canada</a></li>
          <li><a href="#" class="text-dark">Christmas Gift Ideas</a></li>
          <li><a href="#" class="text-dark">Shipping & Returns</a></li>
          <li><a href="#" class="text-dark">Find a store</a></li>
          <li><a href="#" class="text-dark">Events</a></li>
          <li><a href="#" class="text-dark">Frequently Asked Questions</a></li>
          <li><a href="#" class="text-dark">Careers</a></li>
          <li><a href="#" class="text-dark">Give Us Feedback</a></li>
        </ul>
      </div>


      <div class="col-md-3 col-6 mb-3">
        <h5>Social Responsibility</h5>
        <ul class="list-unstyled">
          <li><a href="#" class="text-dark">Sustainability</a></li>
          <li><a href="#" class="text-dark">Diversity, Equity & Inclusion</a></li>
          <li><a href="#" class="text-dark">Iacon Foundation</a></li>
        </ul>
        <h5>More Information</h5>
        <ul class="list-unstyled">
          <li><a href="#" class="text-dark">Our Company</a></li>
          <li><a href="#" class="text-dark">Vendors & Authors</a></li>
          <li><a href="#" class="text-dark">Corporate Sales</a></li>
        </ul>
      </div>


      <div class="col-md-6 mb-3">
        <h5>Join our email list</h5>
        <p class="text-secondary">Get exclusive offers, the best in books, and more. You may unsubscribe at any time.</p>
        <form>
          <div class="input-group">
            <input type="email" class="form-control" placeholder="Email address"/>
            <button class="btn btn-primary" type="submit">Subscribe</button>
          </div>
        </form>
        <div class="social-icons mt-3">

          <a href="#" class="text-dark me-2">Instagram</a>
          <a href="#" class="text-dark me-2">Facebook</a>
          <a href="#" class="text-dark me-2">Pinterest</a>
          <a href="#" class="text-dark me-2">Twitter</a>
          <a href="#" class="text-dark me-2">YouTube</a>
          <a href="#" class="text-dark me-2">TikTok</a>
        </div>
      </div>

    </div>

    <div class="text-center text-secondary py-3 border-top">
      © 2023 Iacon. All rights reserved.
      <a href="#" class="text-dark ms-3">Privacy Policy</a>
      <a href="#" class="text-dark ms-3">Terms of Use</a>
    </div>
  </div>
</footer>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
