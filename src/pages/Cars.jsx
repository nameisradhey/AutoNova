import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, Star, Fuel, Users, Calendar } from 'lucide-react';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const [filters, setFilters] = useState({
    brand: '',
    priceRange: '',
    fuelType: '',
    year: ''
  });

  useEffect(() => {
    const load = async () => {
      const res = await axios.get('http://localhost:4000/api/cars');
      const norm = res.data.map((c) => ({
        id: c._id,
        name: c.name || `${c.make || ''} ${c.model || ''}`.trim() || 'Unknown Car',
        brand: (c.make || '').trim(),
        price: Number(c.price) || 0,
        year: Number(c.year) || new Date().getFullYear(),
        fuelType: (c.fuelType || '').trim(),
        seating: Number(c.seating) || 5,
        image: c.image || c.images?.[0] || 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=600',
        features: Array.isArray(c.features) ? c.features : []
      }));
      setCars(norm);
      setFilteredCars(norm);
      
      // Extract unique years
      const years = [...new Set(norm.map(car => car.year).filter(Boolean))].sort((a, b) => b - a);
      setAvailableYears(years);
    };
    load();
  }, []);

  useEffect(() => {
    let filtered = cars;

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(car =>
        (car.name || '').toLowerCase().includes(searchLower) ||
        (car.brand || '').toLowerCase().includes(searchLower)
      );
    }

    // Brand filter
    if (filters.brand) {
      filtered = filtered.filter(car => 
        (car.brand || '').toLowerCase() === filters.brand.toLowerCase()
      );
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(car => {
        const price = Number(car.price) || 0;
        return price >= min && (max === 999999 ? true : price <= max);
      });
    }

    // Fuel type filter
    if (filters.fuelType) {
      filtered = filtered.filter(car => 
        (car.fuelType || '').toLowerCase() === filters.fuelType.toLowerCase()
      );
    }

    // Year filter
    if (filters.year) {
      filtered = filtered.filter(car => {
        const carYear = Number(car.year) || 0;
        const filterYear = Number(filters.year) || 0;
        return carYear === filterYear;
      });
    }

    setFilteredCars(filtered);
  }, [searchTerm, filters, cars]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      brand: '',
      priceRange: '',
      fuelType: '',
      year: ''
    });
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-28">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 fade-up drop-shadow-lg">
            Our Car Collection
          </h1>
          <p
            className="text-xl text-blue-100 max-w-3xl mx-auto fade-up leading-relaxed"
            style={{ animationDelay: "0.1s" }}
          >
            Explore our extensive collection of premium vehicles
          </p>
        </div>
      </section>

      {/* Content Wrapper */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="backdrop-blur-md bg-white/70 border border-gray-200 rounded-2xl shadow-xl p-6 mb-10 fade-in">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search cars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <select
                value={filters.brand}
                onChange={(e) => handleFilterChange("brand", e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                <option value="">All Brands</option>
                <option value="BMW">BMW</option>
                <option value="Mercedes">Mercedes</option>
                <option value="Audi">Audi</option>
                <option value="Toyota">Toyota</option>
                <option value="Honda">Honda</option>
                <option value="Tesla">Tesla</option>
              </select>

              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange("priceRange", e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                <option value="">All Prices</option>
                <option value="0-40000">Under $40,000</option>
                <option value="40000-60000">$40,000 - $60,000</option>
                <option value="60000-80000">$60,000 - $80,000</option>
                <option value="80000-999999">Above $80,000</option>
              </select>

              <select
                value={filters.fuelType}
                onChange={(e) => handleFilterChange("fuelType", e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                <option value="">All Fuel Types</option>
                <option value="Petrol">Petrol</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
                <option value="Diesel">Diesel</option>
              </select>

              <select
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                <option value="">All Years</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-colors shadow-md"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 fade-in">
          <p className="text-gray-700 font-medium">
            Showing <span className="text-blue-700">{filteredCars.length}</span> of{" "}
            {cars.length} cars
          </p>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 stagger">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition transform hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Image with hover zoom */}
              <div className="overflow-hidden">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-56 object-cover transition-transform duration-500 hover:scale-110"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x300/cccccc/666666?text=Car+Image";
                  }}
                />
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">
                  {car.name}
                </h3>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {car.year}
                  </div>
                  <div className="flex items-center">
                    <Fuel className="h-4 w-4 mr-1" />
                    {car.fuelType}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {car.seating} seats
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {car.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="text-xs font-medium bg-blue-50 text-blue-800 px-3 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <p className="text-2xl font-extrabold text-blue-700 mb-4">
                  ${car.price.toLocaleString()}
                </p>

                <Link
                  to={`/cars/${car.id}`}
                  className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-900 transition-colors block text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCars.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg mt-10 backdrop-blur-md">
            <Filter className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No cars found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={clearFilters}
              className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-900 transition-colors shadow-md"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>


  );
};

export default Cars;