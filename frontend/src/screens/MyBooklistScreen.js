import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../components/UserContext';
import { Button, Card, Form, Container, Row, Col, Badge } from 'react-bootstrap';

const MyBooklistsScreen = () => {
  const { userInfo } = useUserContext();
  const [booklists, setBooklists] = useState([]);
  const [editingBooklist, setEditingBooklist] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    selectedBooks: [],
  });

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

      // Optionally, you can fetch and update the user's collections after creating a new one
      // ...

    } catch (error) {
      console.error('Error creating book collection:', error.message);
    }
  };

  const handleCheckboxChange2 = (bookId) => {
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

  useEffect(() => {
    const fetchBooklists = async () => {
      let userid;
      if (userInfo && userInfo.user && userInfo.user.email) {
        userid = userInfo.user.email;
      }

      try {
        const response = await axios.get(`/wishlist/getuserbooklists/${userid}`);
        setBooklists(response.data);
      } catch (error) {
        console.error('Error fetching user booklists:', error.message);
      }
    };

    fetchBooklists();
  }, []);

  const handleCheckboxChange = (booklistId, checked) => {
    const updatedBooklists = booklists.map((booklist) =>
      booklist._id === booklistId ? { ...booklist, isPrivate: checked } : booklist
    );
    setBooklists(updatedBooklists);
  };

  const handleCreateClick = () => {
    window.open(`/wishlist`, '_blank');
  };

  const handleEditClick = (booklist) => {
    setEditingBooklist(booklist._id);
    setEditingName(booklist.name);
    setEditingDescription(booklist.description);
  };

  const handleSaveEdit = async (booklistId, newName, newDescription, isPrivate) => {
    try {
      const response = await axios.post(`/wishlist/update/${booklistId}`, {
        name: newName,
        description: newDescription,
        userId: userInfo.user.email,
        books: booklists.find((booklist) => booklist._id === booklistId)?.books,
        isPrivate,
      });

      const updatedBooklists = booklists.map((booklist) =>
        booklist._id === booklistId ? response.data : booklist
      );
      setBooklists(updatedBooklists);
      setEditingBooklist(null);
      setEditingName('');
      setEditingDescription('');
    } catch (error) {
      console.error('Error updating booklist:', error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingBooklist(null);
    setEditingName('');
    setEditingDescription('');
  };


  return (

      <Container className="mt-5">
      

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ marginBottom: '20px' }}>Welcome book lovers!</h2>
        <div className="card">
      <h5 className="card-header">Ready to embark on a new literary adventure?</h5>
      <div className="card-body">
        <h5 className="card-title"></h5>
        <p className="card-text">Create your own booklist to curate your favorite reads, discover new gems, and share your literary journey with others!</p>
        <a href="#" className="btn btn-success" onClick={() => handleCreateClick()}>
        Create New Booklist
        </a>
      </div>
    </div>
      </div>
 
      <h2 className="mb-4">My Booklists</h2>
      {booklists.map((booklist) => (
        <Card
          key={booklist._id}
          className="mb-3 bg-light"
        >
          <Card.Body>
            {editingBooklist === booklist._id ? (
              <Form>
                <Form.Group controlId="formName">
                  <Form.Label><b>Title:</b></Form.Label>
                  <Form.Control
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formDescription">
                  <Form.Label><b>Description:</b></Form.Label>
                  <Form.Control
                    as="textarea"
                    value={editingDescription}
                    onChange={(e) => setEditingDescription(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formIsPrivate">
                  <Form.Check
                    type="checkbox"
                    label={<b>Is Private</b>}
                    checked={booklist.isPrivate}
                    onChange={(e) => handleCheckboxChange(booklist._id, e.target.checked)}
                  />
                </Form.Group>
                <Button
                  variant="success"
                  onClick={() =>
                    handleSaveEdit(booklist._id, editingName, editingDescription, booklist.isPrivate)
                  }
                  className="mr-2"
                >
                  Save
                  
                </Button>
                <Button variant="secondary" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </Form>
            ) : (
              <div>
                        <Row>
            <Col md={8} className="text-right">
            <h4>{booklist.name}</h4>
            <p>{booklist.description}</p>

          </Col>

          <Col md={4}>
  <div className="d-flex flex-column align-items-end">
    <div className="ml-auto">
      <Badge variant={booklist.isPrivate ? 'success' : 'warning'}>
        {booklist.isPrivate ? 'Private' : 'Public'}
      </Badge>
    </div>
    <Button
      variant="primary"
      onClick={() => handleEditClick(booklist)}
      className="w-75 mt-2"
    >
      Edit
    </Button>
  </div>
</Col>
            
            </Row>
          <Row>
          <Card.Title>List of Books</Card.Title>
            {booklist.books.map((book) => (
              <Col md={3}>
              <Card key={book._id} className="mb-2" onClick={() => window.open(`/${book.bookId}`, '_blank')}>
                <Card.Body className="d-flex align-items-center">
                  
                  <img src={book.thumbnail} alt={book.title} style={{ width: '50px', height: 'auto' }} />
                  <span className="mr-2">{book.title}</span>
                </Card.Body>
              </Card>
              </Col>
            ))}
          
          
        </Row>
              </div>
            )}
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
  

};

export default MyBooklistsScreen;
