// src/components/AiAdvicePanel.tsx
import React, { useState } from 'react';

interface AiAdvicePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AiAdvicePanel: React.FC<AiAdvicePanelProps> = ({ isOpen, onClose }) => {
  const [funnyModeOn, setFunnyModeOn] = useState(false);

  const getAdvice = () => {
    if (funnyModeOn) {
      return "Alright, look... money. It's like that one relative nobody likes but everyone needs, you know? You got some, you spend it on stupid stuff. You don't got some, well, that's even worse. My advice? Try not to be the guy who buys a speedboat with his rent money. Unless it's a REALLY nice speedboat. What do I know? I'm just a bunch of text.";
    }
    return "Based on your current (mocked) spending, consider allocating more towards savings. Setting up automatic transfers to a high-yield savings account can be beneficial. Also, review your recurring subscriptions for potential savings.";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-end" onClick={onClose}>
      <div 
        className="relative top-0 right-0 h-full w-full md:w-1/3 bg-white p-6 shadow-xl transform transition-transform duration-300 ease-in-out" 
        onClick={(e) => e.stopPropagation()} // Prevent click inside from closing
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">AI Financial Advice</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        
        <div className="mb-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={funnyModeOn} 
              onChange={() => setFunnyModeOn(!funnyModeOn)} 
              className="form-checkbox h-5 w-5 text-purple-600 rounded"
            />
            <span className="text-sm text-gray-700">Toggle "Tough Love" mode</span>
          </label>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-gray-700 whitespace-pre-wrap">
            {getAdvice()}
          </p>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          (This is mocked advice. Consult a professional for real financial planning.)
        </p>
      </div>
    </div>
  );
};

export default AiAdvicePanel;
