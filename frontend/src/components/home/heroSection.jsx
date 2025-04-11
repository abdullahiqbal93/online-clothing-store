import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full mx-auto h-[250px] xs:h-[300px] sm:h-[400px] md:h-[500px] lg:h-[760px] overflow-hidden rounded-2xl xs:rounded-3xl">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-all duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <img
            src={slide}
            className="w-full h-full object-center rounded-3xl"
            alt={`Slide ${index}`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/60 rounded-3xl"></div>
        </div>
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 xs:px-6 z-10">
        <div className="animate-fadeIn max-w-[90%] xs:max-w-full">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Elevate Your <span className="text-yellow-400">Style</span> Today
          </h1>
          <p className="mt-2 xs:mt-4 text-base xs:text-lg sm:text-xl max-w-xl xs:max-w-2xl mx-auto text-gray-100">
            Discover the latest fashion trends and exclusive collections that define who you are.
          </p>
          <div className="mt-6 xs:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 xs:gap-4">
            <Button
              className="px-4 xs:px-6 py-4 xs:py-5 text-base xs:text-lg font-semibold bg-white text-black hover:bg-gray-100 hover:shadow-lg rounded-lg xs:rounded-xl flex items-center gap-2 transition-all duration-200 w-full sm:w-auto"
              onClick={() => navigate('/shop/listing')}
            >
              <ShoppingBag size={18} className="xs:size-20" />
              Shop Now
            </Button>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 left-2 xs:left-4 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full border-none text-white shadow-lg z-10 w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12"
        onClick={() =>
          setCurrentSlide((prevSlide) =>
            prevSlide === 0 ? slides.length - 1 : prevSlide - 1
          )
        }
      >
        <ChevronLeftIcon className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 right-2 xs:right-4 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full border-none text-white shadow-lg z-10 w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12"
        onClick={() => setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)}
      >
        <ChevronRightIcon className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
      </Button>

      <div className="absolute bottom-4 xs:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 xs:space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white w-8" : "bg-white/40 w-4"
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="absolute top-4 xs:top-6 right-4 xs:right-6 z-10 bg-white/10 backdrop-blur-md px-3 xs:px-4 py-1.5 xs:py-2 rounded-full">
        <p className="text-sm font-medium text-white">
          {currentSlide + 1}/{slides.length}
        </p>
      </div>
    </div>
  );
};

export default HeroSection;