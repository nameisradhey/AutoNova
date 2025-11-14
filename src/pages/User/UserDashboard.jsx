import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Car, Calendar, Clock, MapPin, X } from 'lucide-react';

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const [testDrives, setTestDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestDrives = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:4000/api/test-drives/my-bookings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const formattedTestDrives = data.map(td => ({
            id: td._id,
            carName: `${td.carId?.make} ${td.carId?.model}`,
            carBrand: td.carId?.make,
            date: td.date,
            time: td.time,
            status: td.status,
            location: "AutoNova Showroom",
            carImage: td.carId?.images?.[0] || td.carId?.image || "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=300"
          }));
          setTestDrives(formattedTestDrives);
        } else {
          console.error('Failed to fetch test drives');
        }
      } catch (error) {
        console.error('Error fetching test drives:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestDrives();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const cancelTestDrive = async (id) => {
    if (window.confirm('Are you sure you want to cancel this test drive?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:4000/api/test-drives/${id}/cancel`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          setTestDrives(testDrives.map(drive =>
            drive.id === id ? { ...drive, status: 'cancelled' } : drive
          ));
        } else {
          alert('Failed to cancel test drive');
        }
      } catch (error) {
        console.error('Error cancelling test drive:', error);
        alert('Error cancelling test drive');
      }
    }
  };

  const stats = [
    {
      label: 'Total Test Drives',
      value: testDrives.length,
      color: 'bg-blue-500'
    },
    {
      label: 'Confirmed',
      value: testDrives.filter(d => d.status === 'confirmed').length,
      color: 'bg-green-500'
    },
    {
      label: 'Pending',
      value: testDrives.filter(d => d.status === 'pending').length,
      color: 'bg-yellow-500'
    },
    {
      label: 'Completed',
      value: testDrives.filter(d => d.status === 'completed').length,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-blue-200 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 text-center bg-blue-200">
          <h1 className="text-4xl font-bold text-gray-900 pt-10">
            Welcome back, <span className="text-blue-600">{currentUser?.name}</span> 👋
          </h1>
          <p className="text-gray-600 text-lg mt-2">
            Manage your test drives and explore our premium cars
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-xl shadow-md bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 transform hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              <div className="flex flex-col items-center text-center">
                <span className="text-3xl font-bold">{stat.value}</span>
                <p className="mt-2 text-blue-100">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/cars"
              className="flex items-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-gray-200 hover:shadow-lg transition-all"
            >
              <Car className="h-10 w-10 text-blue-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Browse Cars</h3>
                <p className="text-sm text-gray-600">Explore our collection</p>
              </div>
            </Link>

            <Link
              to="/profile"
              className="flex items-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-600 font-semibold text-lg">
                  {currentUser?.name?.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Update Profile</h3>
                <p className="text-sm text-gray-600">Manage your account</p>
              </div>
            </Link>

            <Link
              to="/contact"
              className="flex items-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-white border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-green-600 text-xl">💬</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Contact Support</h3>
                <p className="text-sm text-gray-600">Get help & support</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Test Drives */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">My Test Drives</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your test drives...</p>
            </div>
          ) : testDrives.length === 0 ? (
            <div className="p-10 text-center">
              <Calendar className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No test drives yet
              </h3>
              <p className="text-gray-600 mb-6">
                Book your first test drive and experience AutoNova cars!
              </p>
              <Link
                to="/cars"
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow hover:shadow-lg transition-all"
              >
                Browse Cars
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 ">
              {testDrives.map(drive => (
                <div key={drive.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={drive.carImage}
                        alt={drive.carName}
                        className="w-20 h-20 object-cover rounded-lg shadow"
                      />
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {drive.carName}
                        </h3>
                        <p className="text-gray-600">{drive.carBrand}</p>

                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="mr-4">{drive.date}</span>
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="mr-4">{drive.time}</span>
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{drive.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(drive.status)}`}>
                        {drive.status.charAt(0).toUpperCase() + drive.status.slice(1)}
                      </span>

                      {(drive.status === 'confirmed' || drive.status === 'pending') && (
                        <button
                          onClick={() => cancelTestDrive(drive.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

  );
};

export default UserDashboard;