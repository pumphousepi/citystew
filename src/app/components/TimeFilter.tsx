'use client';

import React from 'react';

interface TimeFilterProps {
  selected: string;
  onChange: (value: string) => void;
}

const options = ['Today', 'This Weekend', 'Next Week'];

export default function TimeFilter({ selected, onChange }: TimeFilterProps) {
  return (
    <div className="flex justify-center space-x-4 my-4">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`px-4 py-2 rounded-md font-semibold transition 
            ${
              selected === option
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
