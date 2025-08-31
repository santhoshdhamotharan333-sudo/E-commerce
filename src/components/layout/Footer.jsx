// src/components/layout/Footer.jsx
const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">E-Commerce</h3>
              <p className="text-gray-300">
                Your one-stop shop for all your needs. Quality products at affordable prices.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-300 hover:text-white">About Us</a></li>
                <li><a href="/contact" className="text-gray-300 hover:text-white">Contact</a></li>
                <li><a href="/faq" className="text-gray-300 hover:text-white">FAQ</a></li>
                <li><a href="/terms" className="text-gray-300 hover:text-white">Terms & Conditions</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2">
                <li><a href="/returns" className="text-gray-300 hover:text-white">Returns & Refunds</a></li>
                <li><a href="/shipping" className="text-gray-300 hover:text-white">Shipping Policy</a></li>
                <li><a href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <address className="text-gray-300 not-italic">
                <p>123 Commerce Street</p>
                <p>Business City, BC 12345</p>
                <p className="mt-2">Email: info@ecommerce.com</p>
                <p>Phone: (123) 456-7890</p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300">
            <p>&copy; {new Date().getFullYear()} E-Commerce. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
  }
  
  export default Footer