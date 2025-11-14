import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Award, Users } from 'lucide-react';
import axios from 'axios';

const Home = () => {
  const [featuredCars, setFeaturedCars] = useState([]);

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const response = await axios.get('/api/cars/featured');
        setFeaturedCars(response.data);
      } catch (error) {
        console.error('Error fetching featured cars:', error);
      }
    };
    
    fetchFeaturedCars();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-800 text-white py-20 fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 fade-up">
              Find Your Perfect Car
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 fade-up" style={{ animationDelay: '0.1s' }}>
              Discover premium vehicles with exceptional quality and service
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center stagger">
              <Link
                to="/cars"
                className="btn-primary text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center glow-hover"
              >
                Browse Cars
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/about"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition-colors glow-hover"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-blue-100 fade-in">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Why Choose <span className="text-blue-600">AutoNova?</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We provide exceptional service and quality vehicles, trusted by thousands of customers.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 stagger">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center transition transform hover:-translate-y-2 hover:shadow-xl">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-blue-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Quality Assurance
              </h3>
              <p className="text-gray-600">
                All our vehicles undergo rigorous quality checks and come with reliable warranties.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center transition transform hover:-translate-y-2 hover:shadow-xl">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Expert Service
              </h3>
              <p className="text-gray-600">
                Our experienced team provides personalized service and professional advice.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center transition transform hover:-translate-y-2 hover:shadow-xl">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Customer Satisfaction
              </h3>
              <p className="text-gray-600">
                Thousands of happy customers trust us for their automotive needs.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Cars */}
      <section className="py-16 soft-gradient fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Cars
            </h2>
            <p className="text-gray-600 text-lg">
              Discover our most popular and premium vehicles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger">
            {featuredCars.map(car => (
              <div key={car._id} className="bg-white rounded-lg shadow-md overflow-hidden card-hover glow-hover">
                <img
                  src={car.image || 'https://via.placeholder.com/400x300/cccccc/666666?text=Car+Image'}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300/cccccc/666666?text=Car+Image';
                  }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{car.make} {car.model}</h3>
                  <p className="text-sm text-gray-600 mb-2">{car.make} • {car.year}</p>
                  <p className="text-2xl font-bold text-blue-700 mb-4">${car.price?.toLocaleString()}</p>
                  <Link
                    to={`/cars/${car._id}`}
                    className="btn-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/cars"
              className="btn-primary text-white px-8 py-3 rounded-lg font-semibold"
            >
              View All Cars
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;