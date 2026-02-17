'use client';
import { useState } from 'react';
import axios from 'axios';

const questions = [
  {
    id: 'symptoms',
    text: 'What are your main symptoms? (Select all that apply)',
    type: 'multi',
    options: ['Headache', 'Dizziness', 'Chest pain', 'Blurred vision', 'Fatigue', 'None of the above'],
  },
  {
    id: 'q2_risk',
    text: 'Have you ever been told you have high blood pressure?',
    type: 'single',
    options: ['Yes', 'No', 'Not sure'],
  },
  {
    id: 'q3_meds',
    text: 'Are you currently on any blood pressure medication?',
    type: 'single',
    options: ['Yes', 'No'],
    condition: (answers) => answers.q2_risk === 'Yes',
  },
];

export default function TriageFlow({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    // Move to next question
    const nextIndex = currentIndex + 1;
    while (nextIndex < questions.length) {
      const nextQ = questions[nextIndex];
      if (!nextQ.condition || nextQ.condition(newAnswers)) {
        setCurrentIndex(nextIndex);
        return;
      }
      setCurrentIndex(nextIndex + 1);
    }
    // All questions done
    submitTriage(newAnswers);
  };

  const submitTriage = async (finalAnswers) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/triage`, { answers: finalAnswers });
      onComplete(res.data.recommendation, finalAnswers);
    } catch (err) {
      console.error(err);
      // fallback
      onComplete('general', finalAnswers);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">{currentQuestion.text}</h2>
      {currentQuestion.type === 'multi' ? (
        <div className="space-y-2">
          {currentQuestion.options.map((opt) => (
            <label key={opt} className="flex items-center">
              <input
                type="checkbox"
                value={opt}
                onChange={(e) => {
                  const checked = e.target.checked;
                  let selected = answers[currentQuestion.id] || [];
                  if (checked) {
                    selected = [...selected, opt];
                  } else {
                    selected = selected.filter((v) => v !== opt);
                  }
                  handleAnswer(currentQuestion.id, selected);
                }}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {currentQuestion.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleAnswer(currentQuestion.id, opt)}
              className="block w-full text-left px-4 py-2 border rounded hover:bg-gray-100"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
      {loading && <p className="mt-4 text-blue-600">Processing...</p>}
    </div>
  );
}