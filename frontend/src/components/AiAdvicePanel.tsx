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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full flex justify-end" onClick={onClose}>
      <div 
        className="relative top-0 right-0 h-full w-full md:w-1/3 bg-app-soft border-l border-border-subtle p-6 shadow-xl shadow-black/60 transform transition-transform duration-300 ease-in-out" 
        onClick={(e) => e.stopPropagation()} // Prevent click inside from closing
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-ink">AI Financial Advice</h2>
          <button onClick={onClose} className="text-ink-soft hover:text-ink text-2xl">&times;</button>
        </div>
        
        <div className="mb-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={funnyModeOn} 
              onChange={() => setFunnyModeOn(!funnyModeOn)} 
              className="form-checkbox h-4 w-4 text-accent-magenta rounded border-border-subtle"
            />
            <span className="text-sm text-ink-soft">Toggle "Tough Love" mode</span>
          </label>
        </div>

        <div className="bg-surface-elevated border border-border-subtle p-4 rounded-lg">
          <p className="text-ink-soft whitespace-pre-wrap">
            {getAdvice()}
          </p>
        </div>

        <p className="mt-4 text-xs text-ink-muted">
          (This is mocked advice. Consult a professional for real financial planning.)
        </p>
      </div>
    </div>
  );
};

export default AiAdvicePanel;
