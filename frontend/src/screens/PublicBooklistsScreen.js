import React, { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../components/UserContext';
import { Container, Row, Col, Card, Button, Form, ListGroup, Image } from 'react-bootstrap';

const PublicBooklistsScreen = () => {
  const { userInfo } = useUserContext();
  const [booklists, setBooklists] = useState([]);
  const [reviews, setReviews] = useState({});
  const [showReviewForm, setShowReviewForm] = useState(null);

  useEffect(() => {
    const fetchPublicBooklists = async () => {
      try {
        const response = await axios.get('/wishlist/getpublicbooklists');
        setBooklists(response.data);

        const reviewsData = {};
        for (const booklist of response.data) {
          const reviewsResponse = await axios.get(`/wishlist/getreviews/${booklist._id}`);
          reviewsData[booklist._id] = reviewsResponse.data;
        }
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching public booklists:', error.message);
      }
    };

    fetchPublicBooklists();
  }, []);

  const handleAddReview = async (booklistId, reviewContent) => {
    try {
      await axios.post('/wishlist/addreview', {
        userId: userInfo.user.email,
        booklistId,
        review: reviewContent,
      });

      const reviewsResponse = await axios.get(`/wishlist/getreviews/${booklistId}`);
      setReviews({ ...reviews, [booklistId]: reviewsResponse.data });
    } catch (error) {
      console.error('Error adding review:', error.message);
    }
  };

  const handleToggleVisibility = async (booklistId, reviewId, visibility) => {
    try {
      await axios.post(`/wishlist/togglevisibility/${reviewId}`, {
        visibility: !visibility,
      });

      const updatedReviewsResponse = await axios.get(`/wishlist/getreviews/${booklistId}`);
      setReviews({ ...reviews, [booklistId]: updatedReviewsResponse.data });
    } catch (error) {
      console.error('Error toggling visibility:', error.message);
    }
  };

  const ReviewForm = ({ booklistId }) => {
    const [reviewContent, setReviewContent] = useState('');

    const handleSubmitReview = () => {
      if (reviewContent.trim() !== '') {
        handleAddReview(booklistId, reviewContent);
        setReviewContent('');
        setShowReviewForm(null);
      }
    };

    return (
      <Form style={{ marginTop: '10px' }}>
        <Form.Group controlId="reviewContent">
          <Form.Control
            as="textarea"
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            placeholder="Add your review..."
          />
        </Form.Group>
        <Button onClick={handleSubmitReview} variant="success" style={{ marginRight: '10px' }}>
          Submit Review
        </Button>
        <Button onClick={() => setShowReviewForm(null)} variant="secondary">
          Cancel
        </Button>
      </Form>
    );
  };

  return (
    <Container style={{ marginTop: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Public Booklists</h2>
        {booklists.map((booklist) => (
          
            <Card className="mb-3 bg-light">
              <Card.Body>
              <h4>{booklist.name}</h4>
            <p>{booklist.description}</p>
            <strong>Owner:</strong> {booklist.firstName}
              </Card.Body>
              <Card.Body>
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
              </Card.Body>
              <Card.Body>
                <Card.Title>Reviews</Card.Title>
                <ListGroup>
                  {reviews[booklist._id] &&
                    reviews[booklist._id]
                      .filter((review) => (userInfo?.user?.role === 'admin' ? true : review.visibility))
                      .map((review) => (

                        
                        <ListGroup.Item key={review._id}>
                          <Card className="bg-light mb-3" style={{ maxWidth: '18rem' }}>
  <Card.Header>From: {review.userId}</Card.Header>
  <Card.Body>
    <Card.Title>{review.review}</Card.Title>
  </Card.Body>
  <Card.Body>
  {userInfo?.user?.role === 'admin' && (
                            <>
                              <strong> {review.visibility ? 'Visible' : 'Hidden'}</strong>
                              <hr />
                              <Button
                                onClick={() => handleToggleVisibility(booklist._id, review._id, review.visibility)}
                                classname="btn-block"
                                variant="danger">
                                {review.visibility ? 'Hide' : 'Unhide'}
                              </Button>
                            </>
                          )}</Card.Body>
</Card>

                          
                        </ListGroup.Item>
                      ))}
                </ListGroup>
                {userInfo && (userInfo.user.role === 'admin' || userInfo.user.role === 'user') && (
                  <>
                    <Button onClick={() => setShowReviewForm(booklist._id)} variant="success" style={{ marginTop: '10px' }}>
                      Add Review
                    </Button>
                    {showReviewForm === booklist._id && <ReviewForm booklistId={booklist._id} />}
                  </>
                )}
              </Card.Body>
            </Card>
        ))}
    </Container>
  );

};

export default PublicBooklistsScreen;
