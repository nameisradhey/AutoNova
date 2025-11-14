import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Car, Users, Calendar, TrendingUp, Eye, UserPlus, CalendarCheck } from 'lucide-react';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    totalUsers: 0,
    totalTestDrives: 0,
    monthlyRevenue: 0
  });

  const [popularCars, setPopularCars] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch cars count
        const carsResponse = await fetch('http://localhost:4000/api/cars', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const cars = carsResponse.ok ? await carsResponse.json() : [];
        
        // Fetch users count (admin endpoint needed)
        const usersResponse = await fetch('http://localhost:4000/api/auth/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const users = usersResponse.ok ? await usersResponse.json() : [];
        console.log('Users response:', users);
        
        // Fetch test drives count
        const testDrivesResponse = await fetch('http://localhost:4000/api/test-drives/admin/all', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const testDrives = testDrivesResponse.ok ? await testDrivesResponse.json() : [];
        console.log('Test drives response:', testDrives);
        
        setStats({
          totalCars: cars.length,
          totalUsers: users.filter(user => user.role === 'user').length,
          totalTestDrives: testDrives.length,
          monthlyRevenue: 125000 // Keep mock for now
        });
        
        console.log('Final stats:', {
          totalCars: cars.length,
          totalUsers: users.filter(user => user.role === 'user').length,
          totalTestDrives: testDrives.length
        });
        
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback to mock data on error
        setStats({
          totalCars: 0,
          totalUsers: 0,
          totalTestDrives: 0,
          monthlyRevenue: 0
        });
      }
    };

    fetchStats();
    
    // Fetch popular cars from test drives data
    const fetchPopularCars = async () => {
      try {
        const token = localStorage.getItem('token');
        const testDrivesResponse = await fetch('http://localhost:4000/api/test-drives/admin/all', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (testDrivesResponse.ok) {
          const testDrives = await testDrivesResponse.json();
          
          // Count test drives per car
          const carCounts = {};
          testDrives.forEach(td => {
            if (td.carId && td.carId.make && td.carId.model) {
              const carName = `${td.carId.make} ${td.carId.model}`;
              carCounts[carName] = (carCounts[carName] || 0) + 1;
            }
          });
          
          // Convert to array and sort by count
          const popularCarsData = Object.entries(carCounts)
            .map(([car, testDrives]) => ({ car, testDrives }))
            .sort((a, b) => b.testDrives - a.testDrives)
            .slice(0, 5); // Top 5
          
          setPopularCars(popularCarsData);
        }
      } catch (error) {
        console.error('Error fetching popular cars:', error);
        // Fallback to empty array
        setPopularCars([]);
      }
    };
    
    fetchPopularCars();
  }, []);

  const statCards = useMemo(() => [
    {
      name: 'Total Cars',
      stat: stats.totalCars,
      icon: Car,
      change: '+4.75%',
      changeType: 'increase',
      color: 'bg-blue-500'
    },
    {
      name: 'Total Users',
      stat: stats.totalUsers,
      icon: Users,
      change: '+12.02%',
      changeType: 'increase',
      color: 'bg-green-500'
    },
    {
      name: 'Test Drives',
      stat: stats.totalTestDrives,
      icon: Calendar,
      change: '+8.30%',
      changeType: 'increase',
      color: 'bg-orange-500'
    },
    {
      name: 'Monthly Revenue',
      stat: `$${(stats.monthlyRevenue / 1000).toFixed(0)}k`,
      icon: TrendingUp,
      change: '+15.45%',
      changeType: 'increase',
      color: 'bg-purple-500'
    }
  ], [stats]);

  return (
    <div className="min-h-screen rounded-3xl flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 p-6">
  {/* Dashboard Card */}
  <div className="w-full max-w-7xl rounded-3xl shadow-2xl backdrop-blur-xl bg-white/60 border border-white/40 p-8">
    
    {/* Header */}
    <div className="mb-8">
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
        Dashboard Overview
      </h1>
      <p className="text-gray-700 text-lg">Welcome to the AutoNova Admin Panel</p>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {statCards.map((item) => (
        <div
          key={item.name}
          className="backdrop-blur-md bg-white/80 border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="p-6 flex items-center">
            <div
              className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center shadow-md`}
            >
              <item.icon className="h-7 w-7 text-white" />
            </div>
            <div className="ml-5">
              <dt className="text-sm font-medium text-gray-500 truncate">
                {item.name}
              </dt>
              <dd className="text-2xl font-bold text-gray-900">{item.stat}</dd>
            </div>
          </div>

        </div>
      ))}
    </div>

    {/* Charts and Activity */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Popular Cars */}
      <div className="backdrop-blur-md bg-white/80 border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="px-6 py-5">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Car className="h-5 w-5 mr-2 text-blue-600" />
            Most Popular Cars
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Car Model</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Test Drives</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {popularCars.map((car, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm text-gray-900">{car.car}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{car.testDrives}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="backdrop-blur-md bg-white/80 border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="px-6 py-5">
          <h3 className="text-xl font-semibold text-gray-900 mb-5">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <Link to="/admin/cars" className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-blue-100 border border-gray-200 rounded-xl hover:scale-105 hover:shadow-md transition-transform">
              <div className="flex items-center">
                <Car className="h-6 w-6 text-blue-600 mr-3" />
                <span className="font-medium text-gray-900">Manage Cars</span>
              </div>
              <span className="text-blue-500 text-lg font-bold">→</span>
            </Link>

            <Link to="/admin/users" className="flex items-center justify-between p-5 bg-gradient-to-r from-green-50 to-green-100 border border-gray-200 rounded-xl hover:scale-105 hover:shadow-md transition-transform">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-green-600 mr-3" />
                <span className="font-medium text-gray-900">View Users</span>
              </div>
              <span className="text-green-500 text-lg font-bold">→</span>
            </Link>

            <Link to="/admin/test-drives" className="flex items-center justify-between p-5 bg-gradient-to-r from-orange-50 to-orange-100 border border-gray-200 rounded-xl hover:scale-105 hover:shadow-md transition-transform">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-orange-600 mr-3" />
                <span className="font-medium text-gray-900">Manage Test Drives</span>
              </div>
              <span className="text-orange-500 text-lg font-bold">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


  );
};

export default AdminOverview;