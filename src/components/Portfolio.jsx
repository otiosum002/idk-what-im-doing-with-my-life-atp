import React from 'react';
import './Portfolio.css';

const Portfolio = ({ title, portfolio, stocks, calculateValue }) => {
  const totalValue = calculateValue(portfolio);

  return (
    <div className="portfolio">
      <div className="portfolio-header">
        <h2>{title}</h2>
      </div>

      <div className="portfolio-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8" />
              <path d="M12 6v2m0 8v2" />
            </svg>
          </div>
          <div className="summary-content">
            <h3>Cash Balance</h3>
            <p className="summary-value">${portfolio.cash.toFixed(2)}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M2 12h20" />
              <path d="M12 6v12M6 12h12" />
            </svg>
          </div>
          <div className="summary-content">
            <h3>Total Value</h3>
            <p className="summary-value">${totalValue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="holdings-section">
        <h3 className="holdings-title">Holdings</h3>
        {Object.keys(portfolio.holdings).length === 0 ? (
          <div className="no-holdings">
            No stocks currently held
          </div>
        ) : (
          <div className="holdings-list">
            {Object.entries(portfolio.holdings).map(([stockId, quantity]) => {
              const stock = stocks.find(s => s.id === parseInt(stockId));
              if (!stock) return null;

              const value = stock.price * quantity;
              const percentage = (value / totalValue) * 100;

              return (
                <div key={stockId} className="holding-item">
                  <div className="holding-header">
                    <span className="stock-name">{stock.name}</span>
                    <span className="stock-sector">{stock.sector}</span>
                  </div>
                  
                  <div className="stock-details">
                    <div className="detail-item">
                      <span className="detail-label">Quantity:</span>
                      <span className="detail-value">{quantity}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Price:</span>
                      <span className="detail-value">${stock.price.toFixed(2)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Value:</span>
                      <span className="detail-value">${value.toFixed(2)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Percentage:</span>
                      <span className="detail-value">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="holding-bar">
                    <div 
                      className="holding-bar-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio; 