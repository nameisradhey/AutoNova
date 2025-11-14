import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Calendar, Fuel, Users, Gauge, Palette, ArrowLeft } from 'lucide-react';

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        console.log('Fetching car with ID:', id);
        const response = await fetch(`http://localhost:4000/api/cars/${id}`);
        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.log('Error response:', errorText);
        }

        if (response.ok) {
          const carData = await response.json();
          console.log('Car data received:', carData);
          setCar(carData);
        } else {
          console.log('Car not found, response not ok');
          setCar(null);
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
        setCar(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-700"></div>
          <p className="mt-4 text-gray-600">Loading car details...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Car not found</h2>
          <Link to="/cars" className="btn-primary text-white px-6 py-3 rounded-lg">
            Back to Cars
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/cars"
            className="flex items-center text-white hover:text-gray-200 transition-colors font-medium drop-shadow"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Cars
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <div>
            <div className="backdrop-blur-md bg-white/80 border border-white/20 rounded-2xl shadow-lg overflow-hidden">
              <img
                src={car.images && car.images.length > 0 ? car.images[activeImage] : car.image}
                alt={car.name || `${car.make} ${car.model}`}
                className="w-full h-96 object-cover"
              />
            </div>

            {car.images && car.images.length > 1 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {car.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`rounded-xl overflow-hidden border-2 shadow-md transition-all ${activeImage === index ? 'border-blue-500 scale-105' : 'border-transparent'
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${car.name || `${car.make} ${car.model}`} ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div>
            <div className="backdrop-blur-md bg-white/90 border border-white/20 rounded-2xl shadow-xl p-8">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
                {car.name || `${car.make} ${car.model}`}
              </h1>

              <p className="text-4xl font-bold text-blue-700 mb-6 drop-shadow">${car.price.toLocaleString()}</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center p-3 bg-blue-50 rounded-xl shadow-sm">
                  <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="font-semibold text-gray-900">{car.year}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-blue-50 rounded-xl shadow-sm">
                  <Fuel className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Fuel Type</p>
                    <p className="font-semibold text-gray-900">{car.fuelType}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-blue-50 rounded-xl shadow-sm">
                  <Users className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Seating</p>
                    <p className="font-semibold text-gray-900">{car.seating} seats</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-blue-50 rounded-xl shadow-sm">
                  <Gauge className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Mileage</p>
                    <p className="font-semibold text-gray-900">{car.mileage} km/l</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Link
                  to={`/test-drive/${car._id}`}
                  className="flex-1 px-8 py-3 rounded-xl font-semibold text-white text-center shadow-md bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all"
                >
                  Book Test Drive
                </Link>
                <Link
                  to="/contact"
                  className="flex-1 px-8 py-3 rounded-xl font-semibold text-blue-700 border-2 border-blue-700 hover:bg-blue-700 hover:text-white transition-all shadow-md text-center"
                >
                  Contact Dealer
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 backdrop-blur-md bg-white/90 border border-white/20 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
          <div className="grid grid-cols-2 gap-3">
            {car.features && car.features.length > 0 ? (
              car.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-gray-800">{feature}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-2">No features listed</p>
            )}
          </div>
        </div>
      </div>
    </div>

  );
};

export default CarDetails;