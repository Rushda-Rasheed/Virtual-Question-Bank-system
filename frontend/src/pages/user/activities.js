import React from 'react';
import Link from 'next/link';
import { FiCalendar, FiClipboard, FiBarChart2 } from 'react-icons/fi';
import Layout from '../../components/Layout';

const Activities = () => {
  return (
    <Layout>
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
      
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Recent Practices</h1>
          <div className="space-y-4">
            <div className="bg-gray-200 p-4 rounded-lg flex items-center">
              <FiClipboard className="text-2xl text-blue-500 mr-4" />
              <div>
                <h2 className="text-lg font-bold">Practice Session 1</h2>
                <p className="text-gray-600">Covered topics: Algebra, Geometry</p>
                <p className="text-gray-500 text-sm">Date: August 15, 2024</p>
              </div>
            </div>
            <div className="bg-gray-200 p-4 rounded-lg flex items-center">
              <FiClipboard className="text-2xl text-blue-500 mr-4" />
              <div>
                <h2 className="text-lg font-bold">Practice Session 2</h2>
                <p className="text-gray-600">Covered topics: Calculus</p>
                <p className="text-gray-500 text-sm">Date: August 14, 2024</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Recent Exams</h2>
          <div className="space-y-4">
            <div className="bg-gray-200 p-4 rounded-lg flex items-center">
              <FiBarChart2 className="text-2xl text-green-500 mr-4" />
              <div>
                <h2 className="text-lg font-bold">Math Exam 1</h2>
                <p className="text-gray-600">Score: 85%</p>
                <p className="text-gray-500 text-sm">Date: August 13, 2024</p>
              </div>
            </div>
            <div className="bg-gray-200 p-4 rounded-lg flex items-center">
              <FiBarChart2 className="text-2xl text-green-500 mr-4" />
              <div>
                <h2 className="text-lg font-bold">Science Exam 2</h2>
                <p className="text-gray-600">Score: 90%</p>
                <p className="text-gray-500 text-sm">Date: August 12, 2024</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Progress Updates</h2>
          <div className="bg-gray-200 p-4 rounded-lg flex items-center">
            <FiCalendar className="text-2xl text-yellow-500 mr-4" />
            <div>
              <h2 className="text-lg font-bold">Progress in Algebra</h2>
              <p className="text-gray-600">Completed 80% of the Algebra course.</p>
              <p className="text-gray-500 text-sm">Last updated: August 15, 2024</p>
            </div>
          </div>
        </div>

      </div>
    </div>
    </Layout>
  );
};

export default Activities;
