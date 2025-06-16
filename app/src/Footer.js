const Footer = () => (
  <footer className="bg-gray-950 text-gray-400 text-sm py-6 mt-12 border-t border-blue-800 font-poppins">
    <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center">
      <p className="mb-2 sm:mb-0">© {new Date().getFullYear()} EscrowApp. All rights reserved.</p>
      <div className="flex gap-4">
        <a
          href="https://github.com/Hayk-1315"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/albert-khudaverdyan-656902253/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition"
        >
          LinkedIn
        </a>
      </div>
    </div>
  </footer>
);
export default Footer;