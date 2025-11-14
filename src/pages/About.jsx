import React from 'react';
import { Award, Users, Car, Clock } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Car, label: 'Cars Sold', value: '10,000+' },
    { icon: Users, label: 'Happy Customers', value: '8,500+' },
    { icon: Award, label: 'Awards Won', value: '25+' },
    { icon: Clock, label: 'Years of Experience', value: '15+' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-28">
        <div className="absolute inset-0 bg-black/40"></div> {/* overlay */}
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
            About <span className="text-yellow-400">AutoNova</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Passionate about connecting people with their perfect vehicles.
            For over 15 years, we’ve been delivering exceptional automotive experiences.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="backdrop-blur-md bg-white/80 border border-white/20 rounded-2xl shadow-lg p-6 text-center transition transform hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900 mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Our Story
            </h2>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              Founded in 2009, AutoNova began as a small family business with a simple mission:
              to help people find their perfect car. What started with a single showroom has grown
              into a trusted automotive partner serving thousands of customers.
            </p>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              We believe that buying a car should be an exciting and straightforward experience.
              That’s why we’ve built our reputation on transparency, quality, and exceptional service.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Today, we continue to evolve and innovate, embracing new technologies while
              maintaining the personal touch our customers love.
            </p>
          </div>
          <div className="relative group">
            <img
              src="https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="AutoNova Showroom"
              className="rounded-2xl shadow-2xl w-full object-cover transform transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 rounded-2xl bg-black/10 group-hover:bg-black/20 transition"></div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Our Mission & Values
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The principles that drive everything we do at AutoNova.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="backdrop-blur-md bg-white/80 border border-white/20 rounded-2xl shadow-lg p-8 text-center transition transform hover:-translate-y-2 hover:shadow-2xl">
              <h3 className="text-xl font-semibold mb-4 text-blue-700">
                Quality First
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We never compromise on quality. Every vehicle in our inventory meets the
                highest standards of performance, safety, and reliability.
              </p>
            </div>

            <div className="backdrop-blur-md bg-white/80 border border-white/20 rounded-2xl shadow-lg p-8 text-center transition transform hover:-translate-y-2 hover:shadow-2xl">
              <h3 className="text-xl font-semibold mb-4 text-blue-700">
                Customer Focus
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your satisfaction is our priority. We listen to your needs and work
                tirelessly to exceed your expectations at every step.
              </p>
            </div>

            <div className="backdrop-blur-md bg-white/80 border border-white/20 rounded-2xl shadow-lg p-8 text-center transition transform hover:-translate-y-2 hover:shadow-2xl">
              <h3 className="text-xl font-semibold mb-4 text-blue-700">
                Innovation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We embrace technology and innovation to make car buying easier,
                faster, and more enjoyable than ever before.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>


  );
};

export default About;