import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Tailwind CSS v4
        </h1>
        <p className="text-gray-700">
          If you see this styled (blue title, white card), Tailwind is working!
        </p>
      </div>
    </div>
  );
};

const container = document.getElementById('root') || document.body;
if (!document.getElementById('root')) {
    const rootDiv = document.createElement('div');
    rootDiv.id = 'root';
    document.body.appendChild(rootDiv);
    createRoot(rootDiv).render(<App />);
} else {
    createRoot(container).render(<App />);
}
