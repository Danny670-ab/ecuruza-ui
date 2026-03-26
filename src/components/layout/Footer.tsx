import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#3F4E40] text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Curuza</h3>
            <p className="text-sm text-gray-300">
              Your trusted e-commerce platform for quality products in Rwanda.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-sm text-gray-300 hover:text-white">About Us</a></li>
              <li><a href="/contact" className="text-sm text-gray-300 hover:text-white">Contact</a></li>
              <li><a href="/faq" className="text-sm text-gray-300 hover:text-white">FAQ</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-md font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="/shipping" className="text-sm text-gray-300 hover:text-white">Shipping Info</a></li>
              <li><a href="/returns" className="text-sm text-gray-300 hover:text-white">Returns</a></li>
              <li><a href="/privacy" className="text-sm text-gray-300 hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-md font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Kigali, Rwanda</li>
              <li>info@curuza.com</li>
              <li>+250 780 000 000</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} Curuza. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;