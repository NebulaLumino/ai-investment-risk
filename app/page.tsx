'use client';

import { useState } from 'react';

const questions = [
  { id: 1, question: "How would you react if your portfolio dropped 20% in a month?", options: [{ label: "Sell everything immediately", score: 1 }, { label: "Hold and wait", score: 3 }, { label: "Buy more at lower prices", score: 5 }] },
  { id: 2, question: "What best describes your investment timeline?", options: [{ label: "Under 3 years", score: 1 }, { label: "3–10 years", score: 3 }, { label: "10+ years", score: 5 }] },
  { id: 3, question: "Which statement fits you best?", options: [{ label: "Preserving my money is the top priority", score: 1 }, { label: "I want balanced growth and safety", score: 3 }, { label: "I am willing to accept volatility for higher returns", score: 5 }] },
  { id: 4, question: "How much investment loss could you absorb without changing your lifestyle?", options: [{ label: "Less than 10% of my portfolio", score: 1 }, { label: "10–25% of my portfolio", score: 3 }, { label: "More than 25% of my portfolio", score: 5 }] },
  { id: 5, question: "Have you invested through a market downturn before?", options: [{ label: "No, I have limited experience", score: 1 }, { label: "Yes, but it was stressful", score: 3 }, { label: "Yes, and I stayed the course confidently", score: 5 }] },
  { id: 6, question: "What is your primary investment goal?", options: [{ label: "Safety and income generation", score: 1 }, { label: "Balanced growth and income", score: 3 }, { label: "Maximum long-term growth", score: 5 }] },
  { id: 7, question: "How would you describe your knowledge of investments?", options: [{ label: "Beginner", score: 1 }, { label: "Intermediate", score: 3 }, { label: "Advanced", score: 5 }] },
];

export default function InvestmentRisk() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [financialSituation, setFinancialSituation] = useState({ income: '', age: '', goals: '', experience: '' });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      generateAnalysis(newAnswers);
    }
  };

  const generateAnalysis = async (finalAnswers: number[]) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers, financialSituation }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate assessment');
      setResult(data.result || '');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setStep(0); setAnswers([]); setResult(''); setError(''); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-500/20 mb-6">
            <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-3">AI Investment Risk Tolerance Assessor</h1>
          <p className="text-gray-400 text-lg">Answer 7 behavioral questions to get your personalized risk profile and asset allocation.</p>
        </div>

        {!result && !loading && step === 0 && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 mb-8">
            <h2 className="text-xl font-semibold mb-6 text-sky-400">Your Financial Situation</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Age</label>
                  <input value={financialSituation.age} onChange={(e) => setFinancialSituation({ ...financialSituation, age: e.target.value })} placeholder="e.g. 35"
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-sky-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Annual Income</label>
                  <input value={financialSituation.income} onChange={(e) => setFinancialSituation({ ...financialSituation, income: e.target.value })} placeholder="e.g. 85000"
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-sky-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Investment Goals</label>
                <input value={financialSituation.goals} onChange={(e) => setFinancialSituation({ ...financialSituation, goals: e.target.value })} placeholder="e.g. Retirement at 60, house down payment"
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-sky-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Investment Experience</label>
                <select value={financialSituation.experience} onChange={(e) => setFinancialSituation({ ...financialSituation, experience: e.target.value })}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-sky-500 focus:outline-none">
                  <option value="">Select experience level</option>
                  <option value="none">None</option>
                  <option value="some">Some (1-3 years)</option>
                  <option value="moderate">Moderate (3-10 years)</option>
                  <option value="extensive">Extensive (10+ years)</option>
                </select>
              </div>
              <button onClick={() => setStep(1)}
                className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-4 rounded-xl transition-colors">
                Continue to Risk Questions →
              </button>
            </div>
          </div>
        )}

        {!result && !loading && step > 0 && step <= questions.length && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-gray-400">Question {step} of {questions.length}</span>
              <span className="text-sky-400 font-medium">{Math.round((step / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5 mb-8">
              <div className="bg-sky-500 h-1.5 rounded-full transition-all" style={{ width: `${(step / questions.length) * 100}%` }} />
            </div>
            <h2 className="text-2xl font-semibold mb-8 text-center">{questions[step - 1].question}</h2>
            <div className="space-y-3">
              {questions[step - 1].options.map((opt, idx) => (
                <button key={idx} onClick={() => handleAnswer(opt.score)}
                  className="w-full text-left bg-gray-700/50 hover:bg-sky-600/30 border border-gray-600 hover:border-sky-500 rounded-xl px-6 py-4 text-white transition-colors">
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-16 flex flex-col items-center justify-center">
            <svg className="animate-spin h-12 w-12 text-sky-500 mb-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            <p className="text-xl text-gray-300">Analyzing your risk profile...</p>
            <p className="text-gray-500 mt-2">Building your personalized allocation</p>
          </div>
        )}

        {(result || error) && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
            {error && <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 text-red-400 mb-6">{error}</div>}
            <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed">
              {result}
            </div>
            <button onClick={reset} className="mt-6 text-sky-400 hover:text-sky-300 text-sm font-medium">
              ← Retake Assessment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
