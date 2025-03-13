
import { useState, useContext } from 'react';
import { useRouter } from 'next/router'; 
import Layout from '../../components/Layout';
import AuthContext from "@/context/AuthContext";
import toast from 'react-hot-toast';
import Select from 'react-select';

export default function Practice() {
  const router = useRouter();
  const { fetchQuestions, startExam, subjects, topics } = useContext(AuthContext);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [subject, setSubject] = useState(null);
  const [topic, setTopic] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  
  const handleFilter = async () => {
    try {
      const questions = await fetchQuestions({
        subject: subject?.value,
        topic: topic?.value,
        difficulty: selectedDifficulty?.value,
        searchKeyword,
      });
      setFilteredQuestions(questions);
      toast.success("Questions filtered successfully!");
    } catch (error) {
      toast.error("Error fetching questions!");
    }
  };

  const handleStartExam = async () => {
    if (filteredQuestions.length === 0) {
      toast.error("Please filter questions before starting the exam!");
      return;
    }
  
   
    const examData = {
      subject: {
        id: subject?.value,
        name: subject?.label,
      },
      topic: {
        id: topic?.value,
        name: topic?.label,
      },
      difficulty: selectedDifficulty?.value,
      questions: filteredQuestions.map(q => ({
        id: q.questionId,
        text: q.text || '',
        images: q.images || [],  
      })),
    };
    
    console.log("Filtered Questions:", filteredQuestions);
    console.log("Exam Data:", examData);
    

   
    localStorage.setItem('examDetails', JSON.stringify(examData));
    localStorage.setItem('filteredQuestions', JSON.stringify(filteredQuestions));
    
  
    
    router.push('/user/exam');
  };
  
  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Practice Questions</h1>

       
        <div className="filter-panel grid grid-cols-1 md:grid-cols-5 gap-5 mb-6">
          
          <Select
            value={subject}
            onChange={setSubject}
            options={subjects.map((sub) => ({
              value: sub._id,
              label: sub.name,
            }))}
            className="h-10 mt-1 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-400"
            placeholder="Filter by Subject"
            isClearable
            required
          />

          
          <Select
            value={topic}
            onChange={setTopic}
            options={topics
              .filter((t) => !subject || t.subject._id === subject.value)
              .map((t) => ({ value: t._id, label: t.name }))} 
            className="h-10 mt-1 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-400"
            placeholder="Filter by Topic"
            isClearable
            required
          />

          
          <Select
            value={selectedDifficulty}
            onChange={setSelectedDifficulty}
            options={[
              { value: 'easy', label: 'Easy' },
              { value: 'medium', label: 'Medium' },
              { value: 'hard', label: 'Hard' },
            ]}
            className="h-10 mt-1 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-400"
            placeholder="Select Difficulty"
            isClearable
          />

          
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="h-10 p-2 mt-1 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-400"
            placeholder="Search questions..."
          />

         
          <div className="mb-4 flex items-end">
            <button 
              onClick={handleFilter} 
              className="h-10 w-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-md"
            >
              Filter
            </button>
          </div>
        </div>

        
        {filteredQuestions.length > 0 && (
          <div className="mb-6">
            <button
              onClick={handleStartExam}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out shadow-md"
            >
              Start Exam
            </button>
          </div>
        )}

        
        <div className="question-list space-y-4">
          {filteredQuestions.map((question) => (
            <div key={question.questionId} className="p-4 bg-white shadow rounded flex flex-col items-start">
              
              <p className="mb-2">{question.text.substring(0, 100)}...</p>

             
              <p className="text-xs text-gray-500 flex items-center space-x-2">
                <span>{`Type: ${question.type}, Subject: ${subject?.label || ''}, Difficulty: ${selectedDifficulty?.label || ''}`}</span>
                

                          {question.images && question.images.length > 0 ? (
          question.images.map((image, index) => {
            
            console.log(`Image URL: http://localhost:5000${image}`);

            return (
                    <img 
                      key={index} 
                      src={`http://localhost:5000${image}`}  
                      alt={`Question Image ${index + 1}`} 
                      className="w-6 h-6 object-cover rounded ml-1" 
                    />
                  );
                })
              ) :  null}

              </p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
