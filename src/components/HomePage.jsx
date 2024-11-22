import React, { useState, useEffect } from 'react';
import { Heart, Plus, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function HomePage() {
  const navigate = useNavigate();
  const [filePreview, setFilePreview] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Please enter a patient name to search.");
      return;  // Prevent search if fullName is empty
    }

    try {
      const encodedFullName = encodeURIComponent(fullName.trim());
      navigate(`/search-results?fullName=${encodedFullName}`);
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <ToastContainer />
      <header className="border-b bg-white/50 backdrop-blur-sm fixed w-screen top-0 z-50">
        <div className="container mx-full px-20 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-indigo-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              LifeLink
            </span>
          </Link>

          <Link to={isAuthenticated ? "/create-patient" : "/signup"}>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-medium transition-all">
              {isAuthenticated ? "Create Patient" : "Register"}
            </button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto  px-4 pt-5 mt-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center ">
          {/* Text Content Section */}
          <div className="space-y-6 md:order-1 order-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Revolutionizing Healthcare Access and Emergency Care by Connecting Hospitals.
            </h1>
            <div className="space-y-4 text-lg text-gray-600">
              <p>Join LifeLink to connect with healthcare professionals, hospitals, and patients for faster, more efficient care.</p>
              <p>Share medical insights, get expert advice, and stay up to date on important health information.</p>
              <p>LifeLink is here to help streamline patient care, reduce delays, and improve outcomes during emergencies.</p>
            </div>
            <div className="flex space-x-4">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-medium transition-all flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Join Now</span>
              </button>
              <button className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8 py-3 rounded-full font-medium transition-all">
                Learn More
              </button>
            </div>
          </div>

          {/* File Upload and Search Section */}
          <div className="relative md:order-2 order-1">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-50 p-10 items-center justify-center">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <input
                    type="search"
                    className="w-full h-16 rounded-xl border-2 border-indigo-600 outline-0 p-6 pr-12"
                    placeholder="Search Patient by name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-600 hover:bg-indigo-100 rounded-full transition-all"
                  >
                    <Search className="h-6 w-6" />
                  </button>
                </div>

                {error && (
                  <p className="text-red-600 text-sm mt-2">{error}</p>
                )}

                <label
                  htmlFor="file-upload"
                  className="h-80 flex items-center justify-center border-2 border-dashed border-indigo-600 rounded-lg cursor-pointer text-indigo-600 hover:bg-indigo-50 transition-all"
                >
                  {filePreview ? (
                    <img
                      src={filePreview}
                      alt="Uploaded preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <span className="text-6xl font-bold">+</span>
                      <span className="text-sm">Search patient by taking a clear picture</span>
                    </div>
                  )}
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>

                {filePreview && (
                  <button
                    type="button"
                    onClick={() => setFilePreview(null)}
                    className="w-full mt-2 text-red-600 hover:bg-red-50 py-2 rounded-md transition-all"
                  >
                    Clear Image
                  </button>
                )}

                <p className="text-sm flex mt-2 text-gray-600">
                  Supported formats: PNG, JPG & JPEG
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
