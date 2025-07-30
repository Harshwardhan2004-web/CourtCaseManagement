import React from 'react';
import { Scale, Shield, Users, Award, ArrowRight, LogIn, UserPlus } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup }) => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Scale className="w-8 h-8 text-white" />
              <span className="text-xl font-bold text-white">LegalFlow</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={onLogin}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
              <button
                onClick={onSignup}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/8112/courthouse-building-architecture-columns.jpg?auto=compress&cs=tinysrgb&w=1920&h=1280&fit=crop')`,
          filter: 'blur(0px)'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-slate-900/80"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/8112/courthouse-building-architecture-columns.jpg?auto=compress&cs=tinysrgb&w=1920&h=1280&fit=crop')`,
            filter: 'blur(3px)',
            zIndex: -1
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Submit Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"> Legal Cases</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Professional legal case management platform. Submit, track, and manage your court cases with confidence and transparency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onSignup}
              className="group flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <button
              onClick={onLogin}
              className="flex items-center justify-center space-x-2 px-8 py-4 bg-white/20 text-white text-lg font-semibold rounded-xl hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border border-white/30"
            >
              <LogIn className="w-5 h-5" />
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose LegalFlow?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamlined legal case management with secure submissions and real-time tracking
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Secure & Confidential</h3>
              <p className="text-gray-600 leading-relaxed">
                Your legal documents and case information are protected with enterprise-grade security and strict confidentiality protocols.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Expert Legal Team</h3>
              <p className="text-gray-600 leading-relaxed">
                Work with experienced legal professionals who understand your case requirements and provide personalized guidance.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Proven Track Record</h3>
              <p className="text-gray-600 leading-relaxed">
                Thousands of successful cases handled with high client satisfaction rates and positive outcomes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Submit Your Case?</h2>
          <p className="text-xl text-gray-200 mb-8">
            Join thousands of satisfied clients who trust LegalFlow with their legal matters.
          </p>
          <button
            onClick={onSignup}
            className="group flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-lg font-semibold rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mx-auto"
          >
            <span>Start Your Case Today</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Scale className="w-6 h-6" />
              <span className="text-lg font-bold">LegalFlow</span>
            </div>
            <p className="text-sm">© 2024 LegalFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;