// src/components/MockChart.tsx
import React from 'react';

const MockChart: React.FC = () => {
  return (
    <div className="bg-surface-elevated border border-dashed border-border-subtle h-64 w-full flex flex-col items-center justify-center rounded-xl">
      <p className="text-ink-muted text-sm mb-1">Mock Chart Placeholder</p>
      <p className="text-ink-soft text-xs">Plug in a real chart library when you're ready</p>
    </div>
  );
};

export default MockChart;
