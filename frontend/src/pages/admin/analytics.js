
import React, { useEffect, useState, useContext } from 'react';
import Layout from '../../components/Layout';
import AuthContext from '@/context/AuthContext';

const Analytics = () => {
  const { getAllExamResults } = useContext(AuthContext);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAnalytics = async () => {
      try {
        const data = await getAllExamResults();
        
        setResults(data || []); 
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data.');
        setLoading(false);
      }
    };

    getAnalytics();
  }, [getAllExamResults]);

  return (
    <Layout>
      <div className="p-6 bg-white text-black">
        <h2 className="text-2xl font-bold mb-6">Analytics & Reporting</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border-b">User ID</th>
                  <th className="px-4 py-2 border-b">Subject Name</th>
                  <th className="px-4 py-2 border-b">Topic Name</th>
                  <th className="px-4 py-2 border-b">Difficulty</th>
                  <th className="px-4 py-2 border-b">Time Taken</th>
                  <th className="px-4 py-2 border-b">Total Questions</th>
                  <th className="px-4 py-2 border-b">Correct Answers</th>
                  <th className="px-4 py-2 border-b">Incorrect Answers</th>
                  <th className="px-4 py-2 border-b">Score</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className="odd:bg-gray-50">
                    <td className="px-4 py-2 border-b">{result.userId}</td>
                    <td className="px-4 py-2 border-b">{result.subject.name}</td>
                    <td className="px-4 py-2 border-b">{result.topic.name}</td>
                    <td className="px-4 py-2 border-b">{result.difficulty}</td>
                    <td className="px-4 py-2 border-b">{result.timeTaken} mins</td>
                    <td className="px-4 py-2 border-b">{result.totalQuestions}</td>
                    <td className="px-4 py-2 border-b">{result.correctAnswers}</td>
                    <td className="px-4 py-2 border-b">{result.incorrectAnswers}</td>
                    <td className="px-4 py-2 border-b">{result.score}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Analytics;
