import { useEffect, useReducer, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Book from "../components/Book";
import { useUserContext } from '../components/UserContext';
import image1 from '../images/about-img.png';
import imageb1 from '../images/b1.jpg';
import imageb2 from '../images/b2.jpg';
import imagec1 from '../images/c1.jpg';
import imagec2 from '../images/c2.jpg';
import imagec3 from '../images/c3.jpg';

import './homepage.css'

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

function HomeScreen() {
  
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

  return (
    <>
      <Helmet>
        <title>Iacon</title>
      </Helmet>
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
                <Book 
                book={book} 
                onAddToCart={addToCartHandler} 
                onAddToWishlist={addToWishlistHandler} />
              </Col>
            ))}
          </Row>
      </div>
    </div>

    <section className="about_section layout_padding">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="img-box">
              <img src={image1} alt="Image 1" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="detail-box">
              <div className="heading_container">
                <h2>About Our Bookstore</h2>
              </div>
              <p>
              Iacon Bookstore offers a curated collection of books spanning diverse genres, providing a seamless online platform for book enthusiasts to explore, discover, and indulge in the joy of reading. Immerse yourself in a world of words at Iacon, where every page turns into a new adventure.
              </p>
              <a href="#">Read More</a>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section className="client_section layout_padding">
      <div className="container">
        <div className="heading_container heading_center">
          <h2>What Says Customers</h2>
          <hr />
        </div>
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="client_container">
              <div className="detail-box">
                <p>
                I absolutely love shopping at Iacon Bookstore! The curated collection is diverse, offering a delightful range of genres. The easy-to-navigate website makes finding my next favorite read a breeze. The personalized recommendations are spot-on, making my book-buying experience truly enjoyable.
                </p>
                <span>
                  <i className="fa fa-quote-left" aria-hidden="true"></i>
                </span>
              </div>
              <div className="client_id">
                <div className="img-box">
                <img src={imagec1}/>
                </div>
                <div className="client_name">
                  <h5>Siddhartha Kaushik</h5>
                  <h6>Student</h6>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 mx-auto">
            <div className="client_container">
              <div className="detail-box">
                <p>
                Iacon Bookstore is my go-to place for literary treasures. The website is not just a store; it's a reading haven. The customer service is exceptional, with prompt responses to inquiries. The seamless checkout process and quick delivery make every purchase a pleasure.
                </p>
                <span>
                  <i className="fa fa-quote-left" aria-hidden="true"></i>
                </span>
              </div>
              <div className="client_id">
                <div className="img-box">
                <img src={imagec2}/>
                </div>
                <div className="client_name">
                  <h5>Harshit Kamboj</h5>
                  <h6>Student</h6>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 mx-auto">
            <div className="client_container">
              <div className="detail-box">
                <p>
                I can't say enough good things about Iacon Bookstore! The quality of service is outstanding, and the well-designed website makes browsing for books a joy. The diverse selection ensures there's something for everyone. Quick shipping and careful packaging show a commitment to customer satisfaction. I've found my bookish paradise!
                </p>
                <span>
                  <i className="fa fa-quote-left" aria-hidden="true"></i>
                </span>
              </div>
              <div className="client_id">
                <div className="img-box">
                <img src={imagec3}/>
                </div>
                <div className="client_name">
                  <h5>Zeeshan Hyder</h5>
                  <h6>Student</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="blog_section layout_padding">
      <div className="container">
        <div className="heading_container heading_center">
          <h2>From Our Blog</h2>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="box">
              <div className="img-box">
              <img src={imageb1}/>
                <h4 className="blog_date">
                  <span>30 December 2022</span>
                </h4>
              </div>
              <div className="detail-box">
                <h5>Exploring Literary Worlds: A Genre Spotlight Series</h5>
                <p>
                Dive into the diverse literary landscapes with our new blog series, where we shine a spotlight on different book genres each month. Whether you're a fan of thrilling mysteries, heartwarming romance, or mind-bending science fiction, our Genre Spotlight Series will introduce you to captivating authors, must-read titles, and hidden gems within each genre. Discover your next favorite book and expand your reading horizons with our insightful recommendations and reviews.
                </p>
                <a href="">Read More</a>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="box">
              <div className="img-box">
              <img src={imageb2}/>
                <h4 className="blog_date">
                  <span>11 January 2023</span>
                </h4>
              </div>
              <div className="detail-box">
                <h5>Behind the Shelves: Unveiling the Stories of Antique Books</h5>
                <p>
                Take a journey through time as we uncover the fascinating stories behind rare and antique books in our blog series, "Behind the Shelves." From first editions of classic novels to centuries-old manuscripts, we'll explore the historical significance, unique features, and the enchanting journey these books have taken to find a place on our shelves. Join us and gain a newfound appreciation for the treasures that make our bookstore a haven for book collectors and history enthusiasts alike.
                </p>
                <a href="">Read More</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
export default HomeScreen;
