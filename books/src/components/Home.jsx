import React, { useState } from 'react';
import Section from './Section';
import Header from './Header';
import Footer from './Footer';
import Navbar from './Navbar';
import axios from 'axios';
import Swal from 'sweetalert2'; 

import biography from '../images/biography.jpeg';
import crime from '../images/crime.jpeg';
import fantasy from '../images/fantasy.jpeg';
import food from '../images/food.jpeg';
import history from '../images/history.jpeg';
import horror from '../images/horror.jpeg';
import kids from '../images/kids.jpeg';
import nonfiction from '../images/non_fiction.jpeg';

import best1 from '../images/best1.jpeg';
import best2 from '../images/best2.jpeg';
import best3 from '../images/best3.jpeg';
import best4 from '../images/best4.jpeg';
import best5 from '../images/best5.jpeg';
import best6 from '../images/best6.jpeg';
import best7 from '../images/best7.jpeg';
import best8 from '../images/best8.jpeg';

import charlesDickens from '../images/charles_dickens.jpg';
import georgeOrwell from '../images/george_orwell.jpg';
import haroldPinter from '../images/harold_pinter.jpg';
import janeAusten from '../images/jane_austen.jpg';

import new1 from '../images/new1.jpeg';
import new2 from '../images/new2.jpeg';
import new3 from '../images/new3.jpeg';
import new4 from '../images/new4.jpeg';
import new5 from '../images/new5.jpeg';
import new6 from '../images/new6.jpeg';
import new7 from '../images/new7.jpeg';

import book1 from '../images/bio1.jpg';
import book2 from '../images/bio2.jpg';
import book3 from '../images/crime1.jpg';
import book4 from '../images/crime2.jpg';
import book5 from '../images/book5.jpg';
import book6 from '../images/book6.jpg';
import book7 from '../images/book7.jpg';
import book8 from '../images/book8.jpg';
import book9 from '../images/book9.jpg';
import book10 from '../images/book10.jpg';
import book11 from '../images/book11.jpg';
import book12 from '../images/book12.jpg';
import book13 from '../images/book13.jpg';
import book14 from '../images/book14.jpg';
import book15 from '../images/book15.jpg';
import book16 from '../images/book16.jpg';

const categoryBooks = {
  Biography: [
    { image: book1, title: 'STEVE JOBS (PB): THE EXCLUSIVE BIOGRAPHY', description: 'This is a riveting book, with as much to say about the transformation of modern life in the information age as about its supernaturally gifted and driven subject' },
    { image: book2, title: 'Elon Musk', description: 'the most fascinating and controversial innovator of our era – a rule-breaking visionary who helped to lead the world into the era of electric vehicles, private space exploration and artificial intelligence.' },
  ],
  Crime: [
    { image: book3, title: 'That Night: Four Friends, Twenty Years', description: 'Natasha, Riya, Anjali and Katherine were best friends in college - each different from the other yet inseparable - until that night.' },
    { image: book4, title: 'The Girl in the Glass Case', description: 'A jealous psychopath hunting another serial killer to regain lost limelight. A feisty young detective caught in the crossfire. Can she end the carnage before she joins the body count?' },
  ],
  Fantasy: [
    { image: book5, title: 'The Wandering Star', description: 'Eloise Hector, the princess of Murkwood, who has always been hidden and suppressed was born with a mysterious glitch. When her mother dies in an accident, she loses control over her powers. ' },
    { image: book6, title: 'RISE OF THE FALLEN', description: 'A cultural fusion. A modern twist. An ancient battle of good and evil. Amidst an eternal family feud, a purposeless and hyper-anxious Rinad discovers that he is part human and part celestial - a Manwaan!' },
  ],
  Food: [
    { image: book7, title: 'Masala Lab: The Science of Indian Cooking', description: 'Masala Lab is a scientific exploration of Indian cooking aimed at inquisitive chefs who want to turn their kitchens into joyful, creative playgrounds for gastronomic experimentation. ' },
    { image: book8, title: 'The Indian Pantry', description: 'In his distinctive, no-holds-barred style, Sanghvi introduces the reader to not only the Indian pantry but also the culture, history and unique experiences that make Indian food so popular the world over.' },
  ],
  History: [
    { image: book9, title: 'A Short History of the World', description: 'Learn about the history of human civilization by H.G. Wells in this beautifully designed edition. ' },
    { image: book10, title: 'The Origin of Species', description: 'Explore the groundbreaking scientific work of Charles Darwin in this edition of The Origin of Species. This book revolutionized our understanding of the natural world and remains a seminal work' },
  ],
  Horror: [
    { image: book11, title: 'The Canterville Ghost', description: 'The Canterville Ghost is a classic tale by Oscar Wilde, first published in 1887. A delightful read for all ages, the story follows the Otis family as they move into Canterville Chase, a haunted mansion in England' },
    { image: book12, title: 'Ghosts of The Silent Hills', description: 'The dead do not rest till they get what they want. You have arrived in the hills. In here, you are surrounded by dense, menacing forests, enveloped in a deadly silence.' },
  ],
  Kids: [
    { image: book13, title: 'Vikram & Betal', description: 'This classic retelling of the adventures of Vikram and Betal combines the old with the new. It takes an insightful, refreshing look at the fascinating encounters between King Vikramaditya and the playful ghost Betal. ' },
    { image: book14, title: 'Tenali Raman', description: 'The classic stories of the Vikatakavi, Tenali Raman, with valuable morals are passed on from generation to generation. This beautifully illustrated book is a compilation of witty Tenali Raman stories.' },
  ],
  'Non Fiction': [
    { image: book15, title: 'Journey To The Centre of The Earth', description: 'Embark on a thrilling subterranean expedition with Journey to the Centre of the Earth by Jules Verne. Join Professor Lidenbrock and his companions as they navigate uncharted depths' },
    { image: book16, title: 'The Time Machine', description: "Embark on a captivating adventure with H.G. Wells' The Time Machine. Witness humanity's future, explore the depths of time, and ponder on profound questions. This unabridged edition guarantees an immersive experience." },
  ],
};

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const openModal = (category) => {
    setSelectedCategory(category);
    setBooks(categoryBooks[category]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory('');
    setBooks([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/inquiries', formData);
      if (response.status === 200 || response.status === 201) {  
        Swal.fire({
          icon: 'success',
          title: 'Inquiry Submitted',
          text: 'Your inquiry form has been successfully submitted!',
        });
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'There was an error submitting your inquiry. Please try again later.',
      });
    }
  };
  

  const Modal = ({ isOpen, onClose, category, books }) => {
    if (!isOpen || !books || books.length === 0) {
      return null; 
    }

    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2">
          <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-4">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {books.map((book, index) => (
              <div key={index} className="card transition-transform transform hover:scale-105">
                <div className="relative w-full h-60 overflow-hidden rounded-lg">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{book.title}</h3>
                  <p>{book.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='container mx-auto p-4'>
      <Navbar />
      <Header />
      <Section id="bookcat" title="Book Categories" className="text-center text-3xl font-serif mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Biography", "Crime", "Fantasy", "Food", "History", "Horror", "Kids", "Non Fiction"].map((category, index) => (
            <div key={index} className="relative cursor-pointer" onClick={() => openModal(category)}>
              <img src={[biography, crime, fantasy, food, history, horror, kids, nonfiction][index]} alt={`Category ${index + 1}`} className="w-full h-64 object-cover transition-transform transform hover:scale-105" />
              <h4 className="absolute bottom-2 left-2 text-white text-lg font-semibold bg-black bg-opacity-50 px-2 py-1 rounded">
                {category}
              </h4>
            </div>
          ))}
        </div>
      </Section>
      <Section id="bestselling" title="Best Selling Books" className="text-center text-3xl font-serif mb-8">
        <div className="flex overflow-x-scroll space-x-4 scrollbar-hide">
          {[best1, best2, best3, best4, best5, best6, best7, best8].map((image, index) => (
            <img key={index} src={image} alt={`Best ${index + 1}`} className="w-60 h-96 object-cover transition-transform transform hover:scale-105" />
          ))}
        </div>
      </Section>
      <Section id="author" title="Authors" className="text-center text-3xl font-serif mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[charlesDickens, georgeOrwell, haroldPinter, janeAusten].map((author, index) => (
            <div key={index} className="card transition-transform transform hover:scale-105">
              <img src={author} alt={`Author ${index + 1}`} className="w-full h-72 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{["Charles Dickens", "George Orwell", "Harold Pinter", "Jane Austen"][index]}</h3>
                <p>{[
                  'Charles Dickens was an extraordinary man. He is best known as a novelist but he was very much more than that. He was as prominent in his other pursuits but they were not areas of life where we can still see him today.',
                  'George Orwell was the pen name of Eric Blair, a twentieth-century writer, equally at home with journalism, essays, novels, literary criticism and social commentary. His Animal Farm and Nineteen Eighty-Four novels are the most famous ones.',
                  'Harold Pinter won the Nobel Prize for Literature in 2005, three years before his death from cancer. He had a career of more than half a century as a playwright, director, actor, and writer of screenplays for television and film.',
                  'Jane Austen is perhaps the best known and best loved of Bath’s many famous residents and visitors. She is indisputably one of the greatest English writers.'
                ][index]}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section id="new" title="New Releases" className="text-center text-3xl font-serif mb-8">
        <div className="flex justify-center flex-wrap space-x-4">
          {[new1, new2, new3, new4].map((image, index) => (
            <img key={index} src={image} alt={`New ${index + 1}`} className="rounded-full w-48 h-48 object-cover transition-transform transform hover:scale-105 mb-4" />
          ))}
        </div>
        <div className="flex justify-center space-x-4">
          {[new5, new6, new7].map((image, index) => (
            <img key={index} src={image} alt={`New ${index + 1}`} className="rounded-full w-36 h-36 object-cover transition-transform transform hover:scale-105" />
          ))}
        </div>
      </Section>

       {/* Inquiry Form */}
       <div className="inquiry-form bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4">Have any questions or inquiries? Let us know!</h2>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                rows="4"
                required
              ></textarea>
            </div>
            <div className="text-center">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
      <Modal isOpen={isModalOpen} onClose={closeModal} category={selectedCategory} books={books} />
    </div>
  );
};

export default Home;
