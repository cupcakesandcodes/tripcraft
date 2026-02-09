import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 z-0 animated-gradient" />
        <div className="absolute inset-0 z-0 bg-black/40" />

        {/* Background and Content */}
        <div
          className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-8 px-4 sm:px-6 md:px-10 lg:px-20 py-20"
        >
          <h1 className="text-5xl font-bold text-center text-white sm:text-6xl md:text-7xl lg:text-8xl fade-in leading-tight">
            🌍 Tripcraft
          </h1>
          <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center text-blue-100 fade-in">
            Crafted Trips, Powered by AI
          </p>
          <p className="max-w-3xl text-lg text-center text-white/90 sm:text-xl md:text-2xl font-light fade-in mt-4">
            Personalized itineraries based on your preferences—destination, budget, dates, and interests. Optimized for time, cost, and unforgettable experiences.
          </p>
          <Link to={'/create-trip'} className="fade-in mt-4">
            <Button className="px-8 py-4 text-lg font-semibold text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-105 hover:from-blue-500 hover:to-purple-500 pulse-glow">
              Start Planning Your Journey
            </Button>
          </Link>
        </div>
      </div>
      {/* About Section */}
      <div className="flex flex-col items-center gap-12 px-4 py-16 bg-gradient-to-b from-white via-blue-50/30 to-white md:px-12 lg:px-20">
        <h2 className="text-3xl font-bold text-center md:text-5xl">
          <span className="gradient-text">About Tripcraft</span>
        </h2>
        <p className="max-w-4xl text-base text-center text-gray-600 md:text-lg leading-relaxed">
          Welcome to a new era of travel planning! Our AI-powered platform simplifies your experience—personalized itineraries,
          hidden gems, and flexible options for solo or family trips.
        </p>
        <div className="grid w-full gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Discover Hidden Gems',
              desc: 'Explore destinations off the beaten path, curated to match your unique preferences.',
              icon: 'https://em-content.zobj.net/source/twitter/348/gem-stone_1f48e.png',
              gradient: 'from-blue-500 to-cyan-500'
            },
            {
              title: 'Seamless Planning',
              desc: 'Let our AI handle the logistics while you focus on enjoying your trip.',
              icon: 'https://em-content.zobj.net/source/twitter/348/fountain-pen_1f58b-fe0f.png',
              gradient: 'from-purple-500 to-pink-500'
            },
            {
              title: 'Flexible Itineraries',
              desc: 'Easily adjust your plans on-the-go to suit changing moods and opportunities.',
              icon: 'https://em-content.zobj.net/source/apple/391/globe-showing-europe-africa_1f30d.png',
              gradient: 'from-orange-500 to-red-500'
            },
          ].map((item, index) => (
            <div key={index} className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                    <img src={item.icon} alt={item.title} className="w-10 h-10 md:w-12 md:h-12" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 md:text-2xl">{item.title}</h3>
                <p className="text-base text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Section */}
      <section className="px-4 py-16 bg-gradient-to-b from-white via-purple-50/20 to-white md:px-12 lg:px-20">
        <h2 className="mb-12 text-3xl font-bold text-center md:text-5xl">
          <span className="gradient-text">Explore Beautiful Destinations</span>
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'Paris, France', image: '/paris.jpg', link: 'https://en.wikipedia.org/wiki/Paris' },
            { name: 'Kyoto, Japan', image: '/kyoto.jpg', link: 'https://en.wikipedia.org/wiki/Kyoto' },
            { name: 'Santorini, Greece', image: '/santorini.jpg', link: 'https://en.wikipedia.org/wiki/Santorini' },
            { name: 'Grand Canyon, USA', image: '/grand-canyon.jpg', link: 'https://en.wikipedia.org/wiki/Grand_Canyon' },
            { name: 'Sydney, Australia', image: '/sydney.jpg', link: 'https://en.wikipedia.org/wiki/Sydney' },
            { name: 'Cape Town, South Africa', image: '/cape-town.jpg', link: 'https://en.wikipedia.org/wiki/Cape_Town' },
          ].map((item, index) => (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              key={index}
              className="group relative block overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative h-64 md:h-72 lg:h-80 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 transform transition-transform duration-300 group-hover:translate-x-2">
                  {item.name}
                </h3>
                <div className="flex items-center text-white/80 text-sm group-hover:text-white transition-colors">
                  <span>Explore destination</span>
                  <svg className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="px-4 mt-20 text-center sm:px-6 lg:px-8">
          <h3 className="mb-4 text-3xl font-bold sm:text-4xl">
            <span className="gradient-text">Ready to Plan Your Perfect Trip?</span>
          </h3>
          <p className="max-w-2xl mx-auto mb-8 text-base text-gray-600 sm:text-lg leading-relaxed">
            Let Tripcraft craft your perfect journey with AI-powered precision and personalization.
          </p>
          <Link to="/create-trip">
            <Button className="px-8 py-4 text-base font-semibold text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-xl sm:text-lg hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 hover:from-blue-500 hover:to-purple-500">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-6 mt-16 text-sm text-center text-gray-500 bg-white">
        <div className="flex items-center justify-center gap-2">
          <span>© {new Date().getFullYear()} Tripcraft – Crafted Trips, Powered by AI</span>
        </div>
      </footer>
    </>
  );
}

export default Hero;
