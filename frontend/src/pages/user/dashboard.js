
import React from "react";
import Link from "next/link";
import { FiBarChart2, FiUsers, FiActivity } from "react-icons/fi";
import Layout from "../../components/Layout";

const Dashboard = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-r from-indigo-50 via-purple-10 to-pink-10 p-8">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg rounded-lg p-8 text-center text-white">
            <h1 className="text-4xl font-extrabold mb-4">
              Welcome to Your Dashboard
            </h1>
            <p className="text-lg font-medium">
              Navigate through your profile, practice sessions, and performance insights.
            </p>
          </div>


          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <Link href="/profile" passHref>
              <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transform transition duration-300 hover:scale-105 cursor-pointer">
                <div className="bg-green-100 text-green-600 rounded-full p-4 w-16 h-16 mx-auto">
                  <FiUsers className="text-4xl" />
                </div>
                <h2 className="text-xl font-semibold mt-4 text-center">Profile</h2>
                <p className="text-center text-sm mt-2 text-gray-500">
                  Manage your personal information and settings.
                </p>
              </div>
            </Link>

            
            <Link href="/user/practice" passHref>
              <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transform transition duration-300 hover:scale-105 cursor-pointer">
                <div className="bg-purple-100 text-purple-600 rounded-full p-4 w-16 h-16 mx-auto">
                  <FiActivity className="text-4xl" />
                </div>
                <h2 className="text-xl font-semibold mt-4 text-center">Practice</h2>
                <p className="text-center text-sm mt-2 text-gray-500">
                  Access questions to enhance your knowledge.
                </p>
              </div>
            </Link>

            
            <Link href="/user/result" passHref>
              <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transform transition duration-300 hover:scale-105 cursor-pointer">
                <div className="bg-blue-100 text-blue-600 rounded-full p-4 w-16 h-16 mx-auto">
                  <FiBarChart2 className="text-4xl" />
                </div>
                <h2 className="text-xl font-semibold mt-4 text-center">Performance</h2>
                <p className="text-center text-sm mt-2 text-gray-500">
                  Track your performance metrics and stats.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
