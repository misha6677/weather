import React from 'react';
import './TogglePeriod.css';

interface TogglePeriodProps {
  isCurrent: boolean;
  setIsCurrent: (value: boolean) => void;
}

const TogglePeriod: React.FC<TogglePeriodProps> = ({ isCurrent, setIsCurrent }) => {
  return (
    <div className="toggle-period">
      <button
        className={isCurrent ? 'active' : ''}
        onClick={() => setIsCurrent(true)}
      >
        Сейчас
      </button>
      <button
        className={!isCurrent ? 'active' : ''}
        onClick={() => setIsCurrent(false)}
      >
        5 дней
      </button>
    </div>
  );
};

export default TogglePeriod;