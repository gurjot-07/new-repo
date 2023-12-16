import React, { useEffect, useState } from 'react';
import { useUserContext } from '../components/UserContext';
import axios from 'axios';
import { Card, Button, Col, Row, Form, Container} from "react-bootstrap";
import { useNavigate  } from 'react-router-dom';

const WishlistScreen = () => {
  const { userInfo } = useUserContext();
  const [wishlist, setWishlist] = useState([]);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    selectedBooks: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    if (userInfo && userInfo.user && userInfo.user.email) {
      const userWishlist = storedWishlist.filter(item => item.userId === userInfo.user.email);
      setWishlist(userWishlist);
    }
  }, [userInfo]);

  const handleCreateCollection = async () => {
    try {
      // Fetch details for the selected books
      const selectedBooksDetails = wishlist
        .filter(item => newCollection.selectedBooks.includes(item.bookId))
        .map(({ bookId, title, author, price, thumbnail }) => ({
          bookId,
          title,
          author,
          price,
          thumbnail,
        }));

      // Make a POST request to create a new book collection
      const response = await axios.post('/wishlist/create', {
        name: newCollection.name,
        description: newCollection.description,
        userId: userInfo.user.email,
        books: selectedBooksDetails,
      });

      console.log('New book collection created:', response.data);

      // Clear the form after successful creation
      setNewCollection({
        name: '',
        description: '',
        selectedBooks: [],
      });

      navigate('/');

    } catch (error) {
      console.error('Error creating book collection:', error.message);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      // Make a DELETE request to your API endpoint to delete the book from the wishlist
      await axios.delete(`/wishlist/delete/${bookId}`);

      // Update the wishlist in state after successful deletion
      const updatedWishlist = wishlist.filter(item => item.bookId !== bookId);
      setWishlist(updatedWishlist);
    } catch (error) {
      console.error('Error deleting book from wishlist:', error.message);
    }
  };

  const handleCheckboxChange = (bookId) => {
    // Toggle the selected state of the book
    setNewCollection(prevState => {
      const isSelected = prevState.selectedBooks.includes(bookId);

      if (isSelected) {
        // Remove from selectedBooks
        return {
          ...prevState,
          selectedBooks: prevState.selectedBooks.filter(id => id !== bookId),
        };
      } else {
        // Add to selectedBooks
        return {
          ...prevState,
          selectedBooks: [...prevState.selectedBooks, bookId],
        };
      }
    });
  };

  const styles = {
    container: {
      margin: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    heading: {
      fontSize: '32px',
      marginBottom: '20px',
      textAlign: 'center',
    },
    wishlist: {
      listStyle: 'none',
      padding: 0,
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center', // Center the wishlist items
    },
    wishlistItem: {
      width: '250px',
      margin: '10px',
      borderRadius: '8px',
      overflow: 'hidden',
      textAlign: 'center',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px',
    },
    checkbox: {
      marginRight: '5px',
    },
    bookImage: {
      maxWidth: '100%',
      height: 'auto',
    },
    createCollectionForm: {
      marginTop: '20px',
      textAlign: 'center',
    },
    input: {
      marginBottom: '10px',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ddd',
    },
    textarea: {
      marginBottom: '10px',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      resize: 'vertical',
    },
    button: {
      padding: '10px',
      cursor: 'pointer',
      borderRadius: '4px',
      border: 'none',
      color: '#fff',
      background: '#2196F3',
    },
  };
  

  return (
    <>
    <Container className="mt-5">
    <div style={{ marginBottom: '20px' }}>
        <h2 style={{ marginBottom: '20px' }}>Create a New Booklist from your Wishlist</h2>
    </div> 

    <div>
      <Card className="mt-4">
        <Card.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="text"
                value={newCollection.name}
                onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description:</Form.Label>
              <Form.Control
                as="textarea"
                value={newCollection.description}
                onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
              />
            </Form.Group>

            
            <hr />
            <Row>
              <Card.Title>List of Available Books</Card.Title>
              {wishlist.length === 0 ? (
                <Col>
                  <p>No books available in the wishlist.</p>
                </Col>
              ) : (
                wishlist.map((item) => (
                  <Col md={3} key={item.bookId}>
                    <Card className="mb-2" style={{ width: '18rem' }}>
                      <Card.Body>
                        <Form.Group controlId={`checkbox${item.bookId}`} className="mb-2">
                          <Form.Check
                            type="checkbox"
                            checked={newCollection.selectedBooks.includes(item.bookId)}
                            onChange={() => handleCheckboxChange(item.bookId)}
                            label={
                              <div>
                                <img src={item.thumbnail} alt={item.title} />
                                <div>
                                  {item.title} by {item.author}
                                </div>
                              </div>
                            }
                          />
                        </Form.Group>
                        <Button variant="danger" onClick={() => handleDeleteBook(item.bookId)}>
                          Delete
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
            <Button type="button" onClick={handleCreateCollection} className="btn btn-success">
              Create Collection
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
    </Container>
    </>
    
  );
};

export default WishlistScreen;
