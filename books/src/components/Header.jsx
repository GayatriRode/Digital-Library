import React, { useState, useEffect } from 'react';

const Header = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const banners = [
    'https://images.unsplash.com/photo-1560693478-dfdb32f2176a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fGxpYnJhcnklMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww',
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fGxpYnJhcnklMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww',
    'https://images.unsplash.com/photo-1495640452828-3df6795cf69b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fGxpYnJhcnklMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww'
  ];

  const quotes = [
    '“The world is the great gymnasium where we come to make ourselves strong.” – Swami Vivekananda',
    '“A mind all logic is like a knife all blade. It makes the hand bleed that uses it.” – Rabindranath Tagore',
    '“An eye for an eye only ends up making the whole world blind.” – Mahatma Gandhi'
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(slideInterval);
  }, [banners.length]);

  return (
    <header className="mx-auto">
      <div className="relative overflow-hidden h-[600px]">
        <div className="absolute inset-0">
          {banners.map((banner, index) => (
            <div
              key={index}
              style={{ backgroundImage: `url(${banner})` }}
              className={`w-full h-full bg-cover bg-center absolute transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center bg-black bg-opacity-50">
          {quotes.map((quote, index) => (
            <p
              key={index}
              className={`transition-opacity duration-1000 text-xl md:text-4xl lg:text-5xl font-semibold animate-fadeIn ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {quote}
            </p>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
