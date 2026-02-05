import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Initialize theme from localStorage or system preference
const initTheme = () => {
    const stored = localStorage.getItem('theme-storage');
    if (stored) {
        try {
            const { state } = JSON.parse(stored);
            if (state?.theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else if (state?.theme === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        } catch (e) {
            // Ignore parse errors
        }
    }
};

initTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
