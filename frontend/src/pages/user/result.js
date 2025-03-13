
import { useEffect, useState, useContext } from 'react';
import AuthContext from "@/context/AuthContext";
import Layout from '../../components/Layout';

const ExamResults = () => {
  const { getExamResults } = useContext(AuthContext);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPreviousResults, setShowPreviousResults] = useState(false);
  const [sortedResults, setSortedResults] = useState([]); 

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getExamResults();
        setResults(data); 
      } catch (error) {
        console.error("Error loading results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [getExamResults]);

  useEffect(() => {
    if (results.length > 0) {
      const sorted = results.reverse(); 
      setSortedResults(sorted);
    }
  }, [results]);

  if (loading) return <div className="text-center text-lg font-semibold">Loading results...</div>;

  const latestResult = sortedResults[0]; 
  const previousResults = sortedResults.slice(1); 
  const handleShowPreviousResults = () => {
    setShowPreviousResults((prev) => !prev);
  };

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Exam Results</h1>
        {sortedResults.length > 0 ? (
          <>
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Exam: {latestResult.subject.name} - {latestResult.topic.name} ({latestResult.difficulty})
              </h2>
              <p className="text-gray-600 mb-1">
                <strong>Score:</strong> {latestResult.score} / {latestResult.totalQuestions}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Duration:</strong> {latestResult.timeTaken}
              </p>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Questions:</h3>
                {latestResult.selectedAnswers.map((answer, idx) => (
                  <div key={idx} className="bg-gray-100 p-4 rounded-lg mb-4">
                    <p className="text-gray-800 mb-1">
                      <strong>Question:</strong> {answer.questionId.questionText}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <strong>Your Answer:</strong> {answer.userAnswer}
                    </p>
                    <p className={`mb-1 ${answer.isCorrect ? "text-green-500" : "text-red-500"}`}>
                      <strong>Status:</strong> {answer.isCorrect ? "Correct" : "Incorrect"}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <strong>Explanation:</strong> {answer.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleShowPreviousResults}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded mb-6"
            >
              {showPreviousResults ? "Hide Previous Results" : "Previous Results"}
            </button>

            {showPreviousResults && previousResults.length > 0 ? (
              previousResults.reverse().map((exam) => (
                <div key={exam._id} className="bg-white shadow-md rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Exam: {exam.subject.name} - {exam.topic.name} ({exam.difficulty})
                  </h2>
                  <p className="text-gray-600 mb-1">
                    <strong>Score:</strong> {exam.score} / {exam.totalQuestions}
                  </p>
                  <p className="text-gray-600 mb-4">
                    <strong>Duration:</strong> {exam.timeTaken}
                  </p>
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-3">Questions:</h3>
                    {exam.selectedAnswers.map((answer, idx) => (
                      <div key={idx} className="bg-gray-100 p-4 rounded-lg mb-4">
                        <p className="text-gray-800 mb-1">
                          <strong>Question:</strong> {answer.questionId.questionText}
                        </p>
                        <p className="text-gray-600 mb-1">
                          <strong>Your Answer:</strong> {answer.userAnswer}
                        </p>
                        <p className={`mb-1 ${answer.isCorrect ? "text-green-500" : "text-red-500"}`}>
                          <strong>Status:</strong> {answer.isCorrect ? "Correct" : "Incorrect"}
                        </p>
                        <p className="text-gray-600 mb-1">
                          <strong>Explanation:</strong> {answer.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : null}
          </>
        ) : (
          <p className="text-center text-gray-700 text-lg">No results found.</p>
        )}
      </div>
    </Layout>
  );
};

export default ExamResults;
