import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and Description */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-4">CityStew</h2>
          <p className="text-gray-400">
            Discover the best events, concerts, and shows happening near you.
          </p>
          <div className="flex space-x-4 mt-6">
            <Link href="#" aria-label="Facebook" className="hover:text-white">
              <FaFacebookF size={20} />
            </Link>
            <Link href="#" aria-label="Twitter" className="hover:text-white">
              <FaTwitter size={20} />
            </Link>
            <Link href="#" aria-label="Instagram" className="hover:text-white">
              <FaInstagram size={20} />
            </Link>
          </div>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Explore</h3>
          <ul className="space-y-2">
            <li><Link href="/events" className="hover:text-white">Events</Link></li>
            <li><Link href="/categories" className="hover:text-white">Categories</Link></li>
            <li><Link href="/top-sellers" className="hover:text-white">Top Sellers</Link></li>
            <li><Link href="/family" className="hover:text-white">Family Events</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-2">
            <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h3 className="text-white font-semibold mb-4">Newsletter</h3>
          <p className="text-gray-400 mb-4">Subscribe to get the latest event updates.</p>
          <form className="flex flex-col space-y-2">
            <input
              type="email"
              placeholder="Your email"
              className="px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 rounded py-2 text-white font-semibold"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} CityStew. All rights reserved.
      </div>
    </footer>
  );
}
