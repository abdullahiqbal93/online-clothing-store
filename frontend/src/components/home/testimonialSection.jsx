import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const TestimonialsSection = ({ testimonialsData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNavigate = (direction) => {
    setCurrentIndex((prevIndex) =>
      (prevIndex + direction + testimonialsData.length) % testimonialsData.length
    );
  };

  const getTestimonial = (index) => {
    const clampedIndex = Math.max(0, Math.min(index, testimonialsData.length - 1));
    return testimonialsData[clampedIndex];
  };

  return (
    <div className="max-w-4xl mx-auto px-4 mb-16">
      <h1 className="text-3xl text-center font-bold py-16">Testimonials</h1>
      <div className="flex flex-col md:flex-row justify-center items-center mt-8 space-y-6 md:space-y-0 md:space-x-6">
        <button
          onClick={() => handleNavigate(-1)}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
        </button>

        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 relative w-full">
          {[currentIndex - 1, currentIndex, currentIndex + 1].map((index, i) => {
            const { image, text, name, rating } = getTestimonial(index);

            const isCenter = i === 1;
            return (
              <div
                key={index}
                className={`${
                  isCenter ? 'scale-105 shadow-xl' : 'scale-95 opacity-20'
                } bg-white p-6 rounded-lg transition-all duration-300 transform ease-in-out w-full md:w-[350px] h-auto md:h-[270px]`}
                style={{
                  zIndex: isCenter ? 2 : 1,
                  transition: 'transform 0.3s ease, opacity 0.3s ease',
                }}
              >
                <img
                  src={image}
                  alt={name}
                  className="w-16 h-16 rounded-full mx-auto mb-4"
                />
                <p className="text-gray-600 italic text-lg mb-4">{text}</p>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
                  <div className="text-yellow-400">
                    {"★".repeat(rating)}
                    {"☆".repeat(5 - rating)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => handleNavigate(1)}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
        >
          <ChevronRightIcon className="h-6 w-6 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default TestimonialsSection;
