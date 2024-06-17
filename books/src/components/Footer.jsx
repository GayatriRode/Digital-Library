import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 px-8">
      <div className="container mx-auto grid grid-cols-3 gap-4">
        <div>
          <h5 className="font-bold mb-2">Information</h5>
          <p>About us</p>
          <p>Delivery Information</p>
          <p>Privacy Policy</p>
          <p>Terms and Conditions</p>
        </div>
        <div>
          <h5 className="font-bold mb-2">Quick Links</h5>
          <p>Support Center</p>
          <p>Shipping</p>
          <p>Help</p>
          <p>FAQs</p>
        </div>
        <div>
          <h5 className="font-bold mb-2">Contact Us</h5>
          <p>9856985698</p>
          <p>8745896325</p>
          <p>digital.library@gmail.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
