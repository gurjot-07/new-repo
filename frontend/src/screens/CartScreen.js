import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MessageBox from '../components/MessageBox';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { useUserContext } from '../components/UserContext';
import { Container } from 'react-bootstrap';


const stripePromise = loadStripe('pk_test_51OJ9ozBnSVSW4jmuXoFvgvGFNDyk8HIop00cy3S7NVYk1LMrQo5Uu7cZllgINUWEvlLwuc8PnXt2BzpUAzHELmSg009R2TdUOE');

export default function CartScreen() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, userInfo, signIn, signOut } = useUserContext();

  useEffect(() => {
    const fetchCart = async () => {
      
      if (!userInfo?.user?.email) {
        // If user info or email is not available, do nothing
        return;
      }
      console.log('userinfo from cart page at- ', userInfo);
      try {
        const response = await axios.get(`/cart/getusercart/${userInfo.user.email}`);
        console.log('Response from server:', response.data);

        setCartItems(response.data.books);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user cart:', error.message);
      }
    };

    fetchCart();
  },  [userInfo]);

  const updateCartHandler = async (bookId, newQuantity) => {
    try {
      let userId = userInfo.user.email;

      const createData = {
        userId , 
        bookId,
        quantity: 1,
      };
      
      await axios.post('/cart/create', createData);
      
      const updatedCartItems = cartItems.map(item =>
        item.booksId === bookId ? { ...item, quantity: newQuantity } : item
      );
  
      // Update the local state
      setCartItems(updatedCartItems);
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      
      
    } catch (error) {
      console.error('Error updating cart:', error.message);
    }
  };

  const removeItemHandler = async (bookId, deletion) => {
    try {
      let userId = userInfo.user.email;;
      const updateData = {
        userId , 
        bookId,
        deletion: deletion,
      };

      await axios.post('/cart/update', updateData);
      
      if (deletion === 'partial') {
      setCartItems(prevCartItems =>
        prevCartItems.map(item =>
          item.booksId === bookId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
      }else if (deletion === 'full'){
        setCartItems(prevCartItems =>
          prevCartItems.filter(item => item.booksId !== bookId)
        );
      }

      const updatedCartItems = deletion === 'partial'
      ? cartItems.map(item =>
          item.booksId === bookId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      : cartItems.filter(item => item.booksId !== bookId);

      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

    } catch (error) {
      console.error('Error removing item from cart:', error.message);
    }
  };

  const checkoutHandler = async () => {
    try {
      const totalAmount = parseFloat(cartItems.reduce((total, item) => total + item.quantity * parseFloat(item.price), 0).toFixed(2));
      console.log('total amount', totalAmount);
      const response = await axios.post('/stripe/payment', {
        total: totalAmount,
      });

      const session = response.data;

      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error.message);
        alert('An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error.message);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container mt-4">
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <Container>
      <h2>Shopping Cart</h2>
      <Row>
        <Col md={7}>
          {loading ? (
            <p>Loading...</p>
          ) : cartItems && cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((book) => (
                <>
                <div className="card mb-3" >
                <div className="row no-gutters">
                  <div className="col-md-3">
                    <img src={book.image}  className="card-img" alt="..." style={{ maxWidth: '160px', maxHeight: '200px' }}/>
                  </div>
                  <div className="col-md-9">
                    <div className="card-body">
                      <h5 className="card-title">{book.title}</h5>
                      <hr/>
                      <p className="card-text">
                        <p><strong>Quantity: </strong>{book.quantity}</p>
                        <p><strong>Price per unit: </strong>{book.price}</p>
                      </p>
                      <p className="card-text">
                      <Button
                          onClick={() => removeItemHandler(book.booksId, 'partial')}
                          variant="light"
                          disabled={book.quantity === 1}
                        >
                          -
                        </Button>{' '}
                        <Button variant="light" onClick={() => updateCartHandler(book.booksId, book.quantity + 1)}>
                          +
                        </Button>
                        <Button onClick={() => removeItemHandler(book.booksId, 'full')} variant="danger">
                          Remove
                        </Button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
                </>))}
                <MessageBox>
              Continue <Link to="/">Shopping</Link>?
            </MessageBox>
            </ListGroup>
          )}
        </Col>
        <Col md={5}>
          <Card>
            <Card.Body>
              <ListGroup>
                <ListGroup.Item>
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items) : ${cartItems.reduce((a, c) => a + c.quantity * parseFloat(c.price), 0).toFixed(2)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div>
                    <Button
                      type="button"
                      variant="success"
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      </Container>
    </div>
  );
}
