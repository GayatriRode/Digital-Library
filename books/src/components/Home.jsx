import React from 'react';
import Section from './Section';
import Header from './Header';
import Footer from './Footer';
import Navbar from './Navbar';

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

const Home = () => {
  return (
    <div className='container mx-auto p-4'>
      <Navbar />
      <Header />
      <Section id="bookcat" title="Book Categories" className="text-center text-3xl font-serif mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[biography, crime, fantasy, food, history, horror, kids, nonfiction].map((image, index) => (
            <div key={index} className="relative">
              <img src={image} alt={`Category ${index + 1}`} className="w-full h-64 object-cover transition-transform transform hover:scale-105" />
              <h4 className="absolute bottom-2 left-2 text-white text-lg font-semibold bg-black bg-opacity-50 px-2 py-1 rounded">
                {["Biography", "Crime", "Fantasy", "Food", "History", "Horror", "Kids", "Non Fiction"][index]}
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
      <Footer />
    </div>
  );
};

export default Home;
