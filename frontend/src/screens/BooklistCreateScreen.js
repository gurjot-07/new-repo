import React from "react";
import { Card, Button, Col, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import { useEffect, useReducer, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Book from "../components/Book";
import { useUserContext } from '../components/UserContext';

const styles = {
    container: {
      padding: '20px',
    },
    heading: {
      fontSize: '32px',
      marginBottom: '20px',
      textAlign: 'center',
    },
    books: {
      listStyle: 'none',
      padding: 0,
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
   
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "FETCH_REQUEST":
        return { ...state, loading: true };
      case "FETCH_SUCCESS":
        return { ...state, books: action.payload, loading: false };
      case "FETCH_FAIL":
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
const BooklistCreateScreen = () => {
    const { isAuthenticated, userInfo } = useUserContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();
    const [{ loading, error, books }, dispatch] = useReducer(reducer, {
      books: [],
      loading: true,
      error: "",
    });

    const handleSearch = async () => {
        //dispatch({ type: "FETCH_REQUEST" });
        try {
          const searchlimit = isAuthenticated ?28:12;
          const response = await axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&maxResults=${searchlimit}`
          );
          setSearchResults(response.data.items || []);
    
          const formattedBooks = response.data.items.map((item) => ({
            bookId: item.id,
            title: item.volumeInfo.title,
            author: item.volumeInfo.authors ? item.volumeInfo.authors[0] : "Unknown",
            price: item.saleInfo && item.saleInfo.retailPrice
              ? `$ ${item.saleInfo.retailPrice.amount}`
              : `Not Available`,
            thumbnail: item.volumeInfo.imageLinks
              ? item.volumeInfo.imageLinks.thumbnail
              : "https://via.placeholder.com/150",
          }));
    
          dispatch({ type: "FETCH_SUCCESS", payload: formattedBooks });
        } catch (error) {
          console.error('Error searching books:', error);
        }
      };

  const addToCartHandler = async (bookId, bookTitle, bookImage, price) => {
    
    try {
      let userId;

      if (isAuthenticated) {
        userId = userInfo.user.email;
      } else {
        console.log('User is not signed in. Show a login modal or redirect to the login page.');
        return;
      }

      const response = await axios.post("/cart/create", {
        userId,
        bookId,
        quantity: 1,
        title: bookTitle,
        image: bookImage,
        price: price,
      });

      console.log("Book added to cart:", response.data);
      navigate('/cart');
    } catch (error) {
      console.error("Error adding book to cart:", error.message);
    }
  };

  const addToWishlistHandler = async (bookId, bookTitle, bookImage, price, author) => {
    try {
      let userId;
      if (isAuthenticated) {
        userId = userInfo.user.email;
      } else {
        console.log('User is not signed in. Show a login modal or redirect to the login page.');
        return;
      }

      const existingWishlist = localStorage.getItem('wishlist');
      const wishlist = existingWishlist ? JSON.parse(existingWishlist) : [];

      const isBookInWishlist = wishlist.some(
        (item) => item.userId === userId && item.bookId === bookId
      );

      if (!isBookInWishlist) {
        wishlist.push({
          userId,
          bookId,
          title: bookTitle,
          author: author,
          thumbnail: bookImage,
          price: price,
        });

        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        console.log("Book added to booklist :", wishlist);
      } else {
        console.log("Book is already in the booklist for this user:", bookTitle);
      }
    } catch (error) {
      console.error("Error adding book to wishlist:", error.message);
    }
  };
return (
    <>
    <div className="container mt-4">
  <div className="row">
    <div className="col-sm heading_container heading_center">

        <h2>Welcome to Iacon!</h2>
        <p>Discover your next favorite read at our bookstore!</p>

    </div>
    <div className="col-sm">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Find your book"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="input-group-append">
            <button
              className="btn btn-success"
              type="button"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
    </div>
  </div>
</div>
     

    <div style={styles.container}>

      <div className="books container">
          <Row>
            {books.map((book, index) => (
              <Col key={index} sm={6} md={4} lg={3} className="mb-3">
                <Card className="bg-light" style={{ cursor: 'pointer' }}>
  <Card.Img variant="top" src={book.thumbnail} alt={book.title} style={{ height: '200px', objectFit: 'contain' }} />
  
  <Card.Body style={{ height: '175px', overflowY: 'auto' }}>
    <Card.Title>{book.title}</Card.Title>


    <Card.Text>Author: {book.author}</Card.Text>
    </Card.Body>
    <Card.Body>
    {isAuthenticated && (
          <>
            <Button variant="success" block style={{ width: '100%'}}>
              Add to Cart
              </Button>
              <Button variant="danger" block style={{ width: '100%'}} className="mt-2">
              Add to Wishlist
              </Button>
          </>
          )}
</Card.Body>
</Card>
              </Col>
            ))}
          </Row>
      </div>
    </div>
    </>
);
}


export default BooklistCreateScreen;
