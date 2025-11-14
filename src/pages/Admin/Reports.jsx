import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Car, Calendar, Download } from 'lucide-react';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [reportData, setReportData] = useState({});

  useEffect(() => {
    // Mock report data
    const mockData = {
      overview: {
        totalUsers: 1250,
        totalCars: 42,
        totalTestDrives: 89,
        conversionRate: 15.5
      },
      userStats: {
        newUsers: [
          { month: 'Jan', count: 45 },
          { month: 'Feb', count: 52 },
          { month: 'Mar', count: 38 },
          { month: 'Apr', count: 61 },
          { month: 'May', count: 74 },
          { month: 'Jun', count: 55 }
        ],
        loginActivity: [
          { date: '2024-01-20', logins: 156 },
          { date: '2024-01-19', logins: 143 },
          { date: '2024-01-18', logins: 167 },
          { date: '2024-01-17', logins: 152 },
          { date: '2024-01-16', logins: 139 }
        ]
      },
      testDriveStats: {
        monthly: [
          { month: 'Jan', booked: 23, completed: 20, cancelled: 3 },
          { month: 'Feb', booked: 31, completed: 28, cancelled: 3 },
          { month: 'Mar', booked: 28, completed: 24, cancelled: 4 },
          { month: 'Apr', booked: 35, completed: 32, cancelled: 3 },
          { month: 'May', booked: 42, completed: 38, cancelled: 4 },
          { month: 'Jun', booked: 38, completed: 35, cancelled: 3 }
        ],
        popularCars: [
          { car: 'BMW X5', testDrives: 15 },
          { car: 'Mercedes C-Class', testDrives: 12 },
          { car: 'Audi A4', testDrives: 10 },
          { car: 'Tesla Model 3', testDrives: 8 },
          { car: 'Honda CR-V', testDrives: 6 }
        ]
      }
    };
    setReportData(mockData);
  }, [selectedPeriod]);

  const statCards = [
    {
      name: 'Total Users',
      stat: reportData.overview?.totalUsers || 0,
      icon: Users,
      change: '+12.02%',
      changeType: 'increase',
      color: 'bg-blue-500'
    },
    {
      name: 'Total Cars',
      stat: reportData.overview?.totalCars || 0,
      icon: Car,
      change: '+4.75%',
      changeType: 'increase',
      color: 'bg-green-500'
    },
    {
      name: 'Test Drives',
      stat: reportData.overview?.totalTestDrives || 0,
      icon: Calendar,
      change: '+8.30%',
      changeType: 'increase',
      color: 'bg-orange-500'
    },
    {
      name: 'Conversion Rate',
      stat: `${reportData.overview?.conversionRate || 0}%`,
      icon: TrendingUp,
      change: '+2.15%',
      changeType: 'increase',
      color: 'bg-purple-500'
    }
  ];

  const exportReport = () => {
    alert('Report exported successfully!');
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 min-h-screen rounded-2xl shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">Reports & Analytics</h1>
          <p className="text-blue-100 text-lg">System analytics and performance reports</p>
        </div>

        <div className="flex space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          <button
            onClick={exportReport}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Download className="h-5 w-5 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((item) => (
          <div
            key={item.name}
            className="backdrop-blur-md bg-white/80 border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center shadow-md`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-700 truncate">{item.name}</dt>
                    <dd>
                      <div className="text-2xl font-bold text-gray-900">{item.stat}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3 rounded-b-2xl">
              <div className="text-sm">
                <span className="text-green-600 font-medium">{item.change}</span>
                <span className="text-gray-500"> from last period</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Registration Chart */}
        <div className="backdrop-blur-md bg-white/80 border border-white/20 rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            User Registration Trends
          </h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Chart visualization would be here</p>
              <p className="text-sm text-gray-400">Monthly new user registrations</p>
            </div>
          </div>
        </div>

        {/* Test Drive Analytics */}
        <div className="backdrop-blur-md bg-white/80 border border-white/20 rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Test Drive Analytics
          </h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Chart visualization would be here</p>
              <p className="text-sm text-gray-400">Test drive completion rates</p>
            </div>
          </div>
        </div>

        {/* Popular Cars Table */}
        <div className="backdrop-blur-md bg-white/80 border border-white/20 rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
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
                {reportData.testDriveStats?.popularCars?.map((car, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm text-gray-900">{car.car}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{car.testDrives}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Login Activity */}
        <div className="backdrop-blur-md bg-white/80 border border-white/20 rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Login Activity</h3>
          <div className="space-y-3">
            {reportData.userStats?.loginActivity?.map((activity, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">{activity.date}</span>
                <span className="text-sm font-semibold text-gray-900">{activity.logins} logins</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="mt-8 backdrop-blur-md bg-white/80 border border-white/20 rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg shadow-sm">
            <h4 className="text-lg font-semibold text-blue-900">Peak Hours</h4>
            <p className="text-sm text-blue-700">Most users are active between 2-4 PM</p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg shadow-sm">
            <h4 className="text-lg font-semibold text-green-900">Top Performing</h4>
            <p className="text-sm text-green-700">BMW models have highest conversion rate</p>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-lg shadow-sm">
            <h4 className="text-lg font-semibold text-orange-900">Growth Trend</h4>
            <p className="text-sm text-orange-700">User registrations up 25% this quarter</p>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Reports;