import React from 'react';
import { FaSquareXTwitter } from 'react-icons/fa6';
import { FaSquareInstagram } from 'react-icons/fa6';
import { FaPinterestSquare } from 'react-icons/fa';
import { FaFacebookSquare } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="p-5 px-5 flex flex-col w-full justify-between pb-10 gap-5 bg-stone-700 dark:bg-stone-900 text-stone-100">
      <div className="flex flex-row gap-2 items-center">
        <div className="text-xl font-josefin mt-2">AUCTION</div>
        <img
          src="src/assets/Pi7_high-speed.png"
          alt="Car Auction Logo"
          className="h-12"
        />
      </div>
      <div className="flex flex-col sm:flex-row  w-full justify-between gap">
        <div className="flex flex-row  w-full justify-items-center pb-10 gap-10 sm:gap-20">
          <div>
            <p className="text-md flex flex-col gap-2 text-nowrap">
              More from Auction
            </p>
            <ul className="flex flex-col gap-1 text-sm text-gray-300">
              <li>
                <Link>Browse Auctions</Link>
              </li>
              <li>
                <Link>Sell Your Car</Link>
              </li>
              <li>
                <Link>FAQs</Link>
              </li>
            </ul>
          </div>
          <div className="text-md flex flex-col gap-2">
            <p>Contact Us</p>
            <div className="text-sm text-gray-400 text-nowrap">
              <p>📍 123 Car Street, City</p>
              <p>📞 +91 98765-43210</p>
              <p>✉️ support@email.com</p>
            </div>
          </div>
        </div>
        <div className="text-md flex flex-col gap-2 pb-10">
          <p>Follow Us</p>
          <div className="flex flex-row gap-2">
            <a href="#" target="_blank" rel="noopener noreferrer" className="">
              <FaPinterestSquare className="w-5 h-5" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="">
              <FaSquareXTwitter className="w-5 h-5" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="">
              <FaFacebookSquare className="w-5 h-5" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="">
              <FaSquareInstagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-around gap-1 text-xs text-gray-500">
        <Link>Privacy Policy</Link>
        <Link>Terms & Conditions</Link>
        <Link>Auction Rules</Link>
      </div>
    </div>
  );
};

export default Footer;
