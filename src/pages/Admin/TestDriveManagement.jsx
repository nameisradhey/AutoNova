import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, User, Car, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const TestDriveManagement = () => {
  const [testDrives, setTestDrives] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestDrives();
  }, []);

  const fetchTestDrives = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/test-drives/admin/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTestDrives(data);
      } else {
        console.error('Failed to fetch test drives');
      }
    } catch (error) {
      console.error('Error fetching test drives:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = useCallback(async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/test-drives/admin/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setTestDrives(prev => prev.map(drive =>
          drive._id === id ? { ...drive, status: newStatus } : drive
        ));
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTestDrives = filterStatus
    ? testDrives.filter(drive => drive.status === filterStatus)
    : testDrives;

  const stats = [
    {
      label: 'Total Test Drives',
      value: testDrives.length,
      color: 'bg-blue-500'
    },
    {
      label: 'Pending',
      value: testDrives.filter(d => d.status === 'pending').length,
      color: 'bg-yellow-500'
    },
    {
      label: 'Confirmed',
      value: testDrives.filter(d => d.status === 'confirmed').length,
      color: 'bg-green-500'
    },
    {
      label: 'Completed',
      value: testDrives.filter(d => d.status === 'completed').length,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 min-h-screen rounded-2xl shadow-2xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg">
          Test Drive Management
        </h1>
        <p className="text-blue-100 text-lg">
          Manage and track all test drive bookings
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="backdrop-blur-md bg-white/80 border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6"
          >
            <div className="flex items-center">
              <div
                className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center shadow-md`}
              >
                <span className="text-white font-bold text-lg">{stat.value}</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-800">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="backdrop-blur-md bg-white/80 border border-white/20 rounded-2xl shadow-md p-4 mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-800">Filter by status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Test Drives List */}
      <div className="backdrop-blur-md bg-white/80 border border-white/20 shadow-md rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-700">Loading test drives...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTestDrives.map((drive) => (
              <div key={drive._id} className="p-6 hover:bg-white/60 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center mr-4">
                        {getStatusIcon(drive.status)}
                        <span
                          className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            drive.status
                          )}`}
                        >
                          {drive.status.charAt(0).toUpperCase() + drive.status.slice(1)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        Booked on {new Date(drive.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Customer Info */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                          <User className="h-5 w-5 mr-2 text-blue-600" />
                          Customer Details
                        </h3>
                        <div className="space-y-1 text-sm text-gray-700">
                          <p><strong>Name:</strong> {drive.customerName}</p>
                          <p><strong>Email:</strong> {drive.customerEmail}</p>
                          <p><strong>Phone:</strong> {drive.customerPhone}</p>
                          {drive.notes && (
                            <p><strong>Message:</strong> {drive.notes}</p>
                          )}
                        </div>
                      </div>

                      {/* Car & Schedule Info */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                          <Car className="h-5 w-5 mr-2 text-blue-600" />
                          Test Drive Details
                        </h3>
                        <div className="space-y-1 text-sm text-gray-700">
                          <p><strong>Car:</strong> {drive.carId?.name || `${drive.carId?.make} ${drive.carId?.model}`}</p>
                          <p className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-blue-600" />
                            <strong>Date:</strong> {drive.date}
                          </p>
                          <p className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-blue-600" />
                            <strong>Time:</strong> {drive.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="ml-6">
                    <div className="flex space-x-2">
                      {drive.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(drive._id, 'confirmed')}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleStatusChange(drive._id, 'cancelled')}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {drive.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusChange(drive._id, 'completed')}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredTestDrives.length === 0 && (
          <div className="p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No test drives found</h3>
            <p className="text-gray-700">
              {filterStatus
                ? `No test drives with status "${filterStatus}"`
                : "No test drives have been booked yet"}
            </p>
          </div>
        )}
      </div>
    </div>

  );
};

export default TestDriveManagement;