import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';

const CarManagement = () => {
  const [cars, setCars] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    price: '',
    year: '',
    fuelType: '',
    seating: '',
    image: '',
    features: ''
  });
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/cars');
      if (response.ok) {
        const data = await response.json();
        setCars(data);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      let imageUrl = formData.image || 'https://via.placeholder.com/400x300/cccccc/666666?text=Car+Image';
      
      // Upload image if a new file is selected
      if (imageFile) {
        const formDataImg = new FormData();
        formDataImg.append('image', imageFile);
        
        const uploadResponse = await fetch('http://localhost:4000/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataImg
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          imageUrl = uploadResult.imageUrl;
        } else {
          const errorText = await uploadResponse.text();
          console.error('Error uploading image:', errorText);
          alert('Error uploading image. Using placeholder instead.');
        }
      }
      
      console.log('Form data before processing:', formData);
      
      const carData = {
        make: formData.make.trim(),
        model: formData.model.trim(),
        price: parseInt(formData.price),
        year: parseInt(formData.year),
        fuelType: formData.fuelType,
        seating: parseInt(formData.seating),
        image: imageUrl,
        features: formData.features ? formData.features.split(',').map(f => f.trim()).filter(f => f) : []
      };
      
      console.log('Sending car data:', carData);
      
      // Validate required fields
      if (!carData.make || !carData.model) {
        alert('Make and Model are required fields');
        return;
      }
      
      // Validate image for new cars
      if (!editingCar && !imageFile) {
        alert('Please select an image for the car');
        return;
      }

      const url = editingCar 
        ? `http://localhost:4000/api/cars/${editingCar._id}`
        : 'http://localhost:4000/api/cars';
      const method = editingCar ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(carData)
      });

      if (response.ok) {
        await fetchCars();
        resetForm();
        alert(editingCar ? 'Car updated successfully!' : 'Car added successfully!');
      } else {
        const errorText = await response.text();
        console.error('Error saving car:', errorText);
        alert('Error saving car. Please try again.');
      }
    } catch (error) {
      console.error('Error saving car:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      make: '',
      model: '',
      price: '',
      year: '',
      fuelType: '',
      seating: '',
      image: '',
      features: ''
    });
    setEditingCar(null);
    setShowModal(false);
    setImageFile(null);
    setImagePreview('');
  };

  const handleEdit = (car) => {
    setFormData({
      make: car.make || car.brand || '',
      model: car.model || '',
      price: car.price ? car.price.toString() : '',
      year: car.year ? car.year.toString() : '',
      fuelType: car.fuelType || '',
      seating: car.seating ? car.seating.toString() : '',
      image: car.image || '',
      features: car.features ? car.features.join(', ') : ''
    });
    setEditingCar(car);
    setShowModal(true);
    setImageFile(null);
    setImagePreview(car.image || '');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:4000/api/cars/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          await fetchCars();
        } else {
          console.error('Error deleting car');
        }
      } catch (error) {
        console.error('Error deleting car:', error);
      }
    }
  };

  const filteredCars = cars.filter(car =>
    `${car.make} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.make.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex rounded-3xl items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 p-6">
        <div className="text-white text-xl">Loading cars...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex rounded-3xl items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 p-6">
      {/* Main Glass Container */}
      <div className="w-full max-w-7xl rounded-3xl shadow-2xl backdrop-blur-xl bg-white/60 border border-white/40 p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Car Management</h1>
            <p className="text-gray-700">Manage your car inventory</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center shadow-md transition"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Car
          </button>
        </div>

        {/* Search and Filter */}
        <div className="backdrop-blur-md bg-white/80 border border-gray-200 rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search cars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-5 w-5 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map(car => {
            const carMake = car.make || car.brand || 'Unknown';
            const carModel = car.model || 'Model';
            return (
              <div key={car._id} className="backdrop-blur-md bg-white/80 border border-gray-200 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                <img
                  src={car.image || 'https://via.placeholder.com/400x300/cccccc/666666?text=No+Image'}
                  alt={`${carMake} ${carModel}`}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300/cccccc/666666?text=Car+Image';
                  }}
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{carMake} {carModel}</h3>
                  <p className="text-gray-600 mb-2">{carMake}</p>
                  <p className="text-2xl font-bold text-blue-700 mb-4">
                    ${car.price ? car.price.toLocaleString() : 'N/A'}
                  </p>

                  <div className="text-sm text-gray-600 mb-4">
                    <p>Year: {car.year || 'N/A'}</p>
                    <p>Fuel: {car.fuelType || 'N/A'}</p>
                    <p>Seating: {car.seating || 'N/A'}</p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(car)}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(car._id)}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative mx-auto p-6 w-96 rounded-2xl shadow-2xl backdrop-blur-xl bg-white/90 border border-white/40">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingCar ? 'Edit Car' : 'Add New Car'}
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Make
                  </label>
                  <input
                    type="text"
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fuel Type
                    </label>
                    <select
                      value={formData.fuelType}
                      onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Seating
                    </label>
                    <input
                      type="number"
                      value={formData.seating}
                      onChange={(e) => setFormData({ ...formData, seating: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Car Image {editingCar ? '(Optional)' : '(Required)'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!editingCar}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-md border"
                      />
                    </div>
                  )}
                  {!editingCar && !imagePreview && (
                    <p className="text-sm text-gray-500 mt-1">Please select an image for the car</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Features (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    {editingCar ? 'Update' : 'Add'} Car
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default CarManagement;