import React, { useState } from 'react';
import './StockMarket.css';

const StockMarket = ({ 
  stocks, 
  onTrade, 
  playerCash,
  playerPortfolio,
  currentPhase,
  isPhaseComplete,
  onPhaseComplete,
  onNextPhase,
  showResults
}) => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const handleTrade = (action) => {
    if (!selectedStock) return;
    onTrade(selectedStock.id, action, quantity);
    setQuantity(1);
  };

  const getPhaseDescription = (phase) => {
    switch (phase) {
      case 1:
        return 'A global pandemic has caused unprecedented market disruption. Choose your investments wisely.';
      case 2:
        return 'The economy is showing signs of recovery. Some sectors are bouncing back while others face new challenges.';
      case 3:
        return 'The market is undergoing a major transformation. New technologies and regulations are reshaping industries.';
      default:
        return '';
    }
  };

  return (
    <div className="stock-market">
      <div className="market-header">
        <h2>Stock Market</h2>
        <div className="phase-badge">Phase {currentPhase}</div>
      </div>

      <div className="phase-description">
        <svg className="phase-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M2 12h20" />
        </svg>
        <p>{getPhaseDescription(currentPhase)}</p>
      </div>
      
      <div className="cash-balance">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8" />
          <path d="M12 6v2m0 8v2" />
        </svg>
        Available Cash: ${playerCash.toFixed(2)}
      </div>
      
      <div className="stocks-grid">
        {stocks.map(stock => (
          <div 
            key={stock.id} 
            className={`stock-card ${selectedStock?.id === stock.id ? 'selected' : ''}`}
            onClick={() => setSelectedStock(stock)}
          >
            <div className="stock-card-header">
              <h3>{stock.name}</h3>
              <span className="stock-sector">{stock.sector}</span>
            </div>
            
            <div className="stock-price">
              <span className="price-label">Price:</span>
              <span className="price-value">${stock.price.toFixed(2)}</span>
              {isPhaseComplete && (
                <span className={`price-change ${stock[`phase${currentPhase}Impact`].price > stock.price ? 'positive' : 'negative'}`}>
                  {stock[`phase${currentPhase}Impact`].price > stock.price ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 19V5M5 12l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                  )}
                  {Math.abs(((stock[`phase${currentPhase}Impact`].price - stock.price) / stock.price) * 100).toFixed(1)}%
                </span>
              )}
            </div>

            <div className="stock-description">
              {stock.description}
            </div>

            {isPhaseComplete && (
              <div className="phase-impact">
                <h4>Phase {currentPhase} Impact</h4>
                <p>{stock[`phase${currentPhase}Impact`].description}</p>
                <p className="new-price">New Price: ${stock[`phase${currentPhase}Impact`].price.toFixed(2)}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedStock && !isPhaseComplete && (
        <div className="trade-panel">
          <div className="trade-panel-header">
            <h3>Trade {selectedStock.name}</h3>
            <span className="current-price">Current Price: ${selectedStock.price.toFixed(2)}</span>
          </div>
          
          <div className="trade-controls">
            <div className="quantity-control">
              <label>Quantity:</label>
              <div className="quantity-input-wrapper">
                <button 
                  className="quantity-btn"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                />
                <button 
                  className="quantity-btn"
                  onClick={() => setQuantity(prev => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="trade-total">
              Total: ${(selectedStock.price * quantity).toFixed(2)}
            </div>

            <div className="trade-buttons">
              <button 
                className="buy-button"
                onClick={() => handleTrade('buy')}
                disabled={playerCash < selectedStock.price * quantity}
              >
                Buy
              </button>
              <button 
                className="sell-button"
                onClick={() => handleTrade('sell')}
                disabled={!selectedStock || !playerPortfolio.holdings[selectedStock.id] || playerPortfolio.holdings[selectedStock.id] < quantity}
              >
                Sell
              </button>
            </div>
          </div>
        </div>
      )}

      {!isPhaseComplete && (
        <div className="phase-controls">
          <button 
            className="complete-phase-button"
            onClick={onPhaseComplete}
          >
            Complete Phase {currentPhase}
          </button>
        </div>
      )}

      {isPhaseComplete && !showResults && (
        <div className="phase-controls">
          <button 
            className="next-phase-button"
            onClick={onNextPhase}
          >
            {currentPhase === 3 ? 'View Final Results' : 'Next Phase'}
          </button>
        </div>
      )}
    </div>
  );
};

export default StockMarket; 