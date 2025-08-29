import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ label, value, onChange, ...props }) => (
  <div className="flex flex-col mb-4">
    {label && <label className="mb-2 text-sm font-medium text-gray-700">{label}</label>}
    <input
      {...props}
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
    />
  </div>
);

export default Input;
