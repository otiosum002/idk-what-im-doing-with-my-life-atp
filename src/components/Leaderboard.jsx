import React from 'react';
import './Leaderboard.css';

const Leaderboard = ({ playerValue, botValue }) => {
  const difference = playerValue - botValue;
  const isPositive = difference >= 0;

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h2>Performance Comparison</h2>
      </div>

      <div className="comparison-container">
        <div className="comparison-card">
          <h3>Your Portfolio</h3>
          <p className="value">${playerValue.toFixed(2)}</p>
        </div>

        <div className={`comparison-card difference ${isPositive ? 'positive' : 'negative'}`}>
          <h3>Difference</h3>
          <div className="difference-value">
            {isPositive ? (
              <svg className="trend-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            ) : (
              <svg className="trend-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            )}
            ${Math.abs(difference).toFixed(2)}
          </div>
        </div>

        <div className="comparison-card">
          <h3>Bot Portfolio</h3>
          <p className="value">${botValue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 