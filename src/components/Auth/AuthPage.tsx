import React, { useState } from 'react';
import { Receipt, TrendingUp, Shield, Zap } from 'lucide-react';
import { LoginForm } from './LoginForm';

export const AuthPage: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);

  const features = [
    {
      icon: Receipt,
      title: 'Smart Expense Tracking',
      description: 'Upload receipts and let AI extract data automatically'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Analytics',
      description: 'Get insights into spending patterns and trends'
    },
    {
      icon: Shield,
      title: 'Secure Approvals',
      description: 'Streamlined approval workflow with audit trails'
    },
    {
      icon: Zap,
      title: 'ABBYY Integration',
      description: 'Powered by ABBYY Vantage for accurate data extraction'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="flex min-h-screen">
        {/* Left Side - Branding and Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex-col justify-center">
          <div className="max-w-lg">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-white p-3 rounded-xl">
                <Receipt className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">ExpenseFlow</h1>
                <p className="text-blue-100">Smart Expense Management</p>
              </div>
            </div>

            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Streamline Your Expense Management
            </h2>
            <p className="text-xl text-blue-100 mb-12">
              Upload, track, and approve expenses with AI-powered data extraction 
              and intelligent workflow automation.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-blue-500 p-2 rounded-lg flex-shrink-0">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{feature.title}</h3>
                      <p className="text-blue-100 text-sm">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <LoginForm 
            onToggleMode={() => setIsSignup(!isSignup)} 
            isSignup={isSignup}
          />
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden absolute top-0 left-0 right-0 p-6">
        <div className="flex items-center justify-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Receipt className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ExpenseFlow</h1>
            <p className="text-sm text-gray-600">Smart Expense Management</p>
          </div>
        </div>
      </div>
    </div>
  );
};