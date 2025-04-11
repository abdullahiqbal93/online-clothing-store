import React from 'react';
import { FaFacebookSquare, FaWhatsapp, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { AiFillTikTok } from 'react-icons/ai';

const AboutUsSection = ({ aboutImg }) => {
  return (
    <section id="about-us" className="max-w-5xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-medium text-gray-800 mb-4 tracking-wide">
          About Us
        </h1>
        <p className="text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
          At Flexxy, we craft stylish, high-quality apparel that’s affordable and sustainable. Fashion, redefined.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <div className="flex justify-center items-center">
          <img
            src={aboutImg}
            alt="Fashion"
            className="rounded-lg w-full max-w-md object-cover"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-medium text-gray-800 tracking-tight">
            Who We Are
          </h2>
          <p className="text-base text-gray-600 leading-relaxed">
            We’re a team passionate about blending trends with timeless style. Our collections prioritize quality, comfort, and inclusivity—designed for everyone.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-12 text-center">
        <h2 className="text-2xl font-medium text-gray-800 mb-6 tracking-tight">
          Get in Touch
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">Phone</h3>
            <a
              href="tel:+94787529260"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              +94 787529260
            </a>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">Store</h3>
            <p className="text-gray-600">Kawdana Road, Sri Lanka</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Follow Us</h3>
            <div className="flex justify-center space-x-6">
              <a
                href="https://www.facebook.com/flexxy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaFacebookSquare size={20} />
              </a>
              <a
                href="https://www.instagram.com/flexxy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://www.linkedin.com/company/flexxy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@flexxy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <AiFillTikTok size={20} />
              </a>
              <a
                href="https://wa.me/94787529260"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;