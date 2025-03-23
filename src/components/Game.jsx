import React, { useState, useEffect } from 'react';
import StockMarket from './StockMarket';
import Portfolio from './Portfolio';
import Leaderboard from './Leaderboard';
import './Game.css';

const INITIAL_BALANCE = 1000;

const initialStocks = [
  {
    id: 1,
    name: 'TechCorp',
    price: 100,
    sector: 'Technology',
    description: 'A leading technology company specializing in cloud computing and AI. Pros: Strong market position, innovative products. Cons: High competition, regulatory risks.',
    phase1Impact: { price: 120, description: 'TechCorp benefited from increased demand for cloud services during the pandemic.' },
    phase2Impact: { price: 80, description: 'TechCorp faced supply chain disruptions and chip shortages.' },
    phase3Impact: { price: 150, description: 'TechCorp successfully launched a new AI platform, boosting investor confidence.' }
  },
  {
    id: 2,
    name: 'HealthCare Plus',
    price: 150,
    sector: 'Healthcare',
    description: 'A healthcare provider focusing on telemedicine and digital health. Pros: Growing market, essential service. Cons: High operational costs, regulatory compliance.',
    phase1Impact: { price: 200, description: 'HealthCare Plus saw massive growth in telemedicine services.' },
    phase2Impact: { price: 130, description: 'Healthcare Plus faced staffing shortages and increased costs.' },
    phase3Impact: { price: 180, description: 'Healthcare Plus expanded into new markets, improving profitability.' }
  },
  {
    id: 3,
    name: 'EnergyCo',
    price: 80,
    sector: 'Energy',
    description: 'An energy company transitioning to renewable sources. Pros: Green energy focus, government support. Cons: High capital expenditure, market volatility.',
    phase1Impact: { price: 60, description: 'EnergyCo suffered from reduced energy demand during lockdowns.' },
    phase2Impact: { price: 100, description: 'EnergyCo benefited from rising oil prices and increased renewable investments.' },
    phase3Impact: { price: 70, description: 'EnergyCo faced challenges with new environmental regulations.' }
  },
  {
    id: 4,
    name: 'FinanceBank',
    price: 120,
    sector: 'Finance',
    description: 'A traditional bank expanding into digital banking. Pros: Stable business model, strong balance sheet. Cons: Interest rate sensitivity, regulatory changes.',
    phase1Impact: { price: 90, description: 'FinanceBank faced increased loan defaults and reduced interest rates.' },
    phase2Impact: { price: 140, description: 'FinanceBank benefited from rising interest rates and improved loan quality.' },
    phase3Impact: { price: 110, description: 'FinanceBank faced increased competition from fintech companies.' }
  },
  {
    id: 5,
    name: 'RetailPro',
    price: 90,
    sector: 'Retail',
    description: 'A retail chain with strong e-commerce presence. Pros: Omnichannel strategy, brand recognition. Cons: Thin margins, competition from online retailers.',
    phase1Impact: { price: 70, description: 'RetailPro struggled with store closures and supply chain issues.' },
    phase2Impact: { price: 110, description: 'RetailPro benefited from strong online sales and reopening of stores.' },
    phase3Impact: { price: 85, description: 'RetailPro faced increased competition and rising operational costs.' }
  }
];

const Game = () => {
  const [stocks, setStocks] = useState(initialStocks);
  const [playerPortfolio, setPlayerPortfolio] = useState({
    cash: INITIAL_BALANCE,
    holdings: {},
  });
  const [botPortfolio, setBotPortfolio] = useState({
    cash: INITIAL_BALANCE,
    holdings: {},
  });
  const [currentPhase, setCurrentPhase] = useState(1);
  const [isPhaseComplete, setIsPhaseComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Bot trading logic
  const botTrade = () => {
    const availableStocks = stocks.filter(stock => 
      botPortfolio.cash >= stock.price || botPortfolio.holdings[stock.id] > 0
    );

    if (availableStocks.length === 0) return;

    const randomStock = availableStocks[Math.floor(Math.random() * availableStocks.length)];
    const action = Math.random() > 0.5 ? 'buy' : 'sell';
    
    // Calculate maximum quantity based on available cash or holdings
    let maxQuantity;
    if (action === 'buy') {
      maxQuantity = Math.floor(botPortfolio.cash / randomStock.price);
    } else {
      maxQuantity = botPortfolio.holdings[randomStock.id] || 0;
    }
    
    // Ensure quantity is at least 1 and not more than max
    const quantity = Math.max(1, Math.min(Math.floor(Math.random() * 3) + 1, maxQuantity));

    if (action === 'buy' && botPortfolio.cash >= randomStock.price * quantity) {
      setBotPortfolio(prev => ({
        ...prev,
        cash: Math.max(0, prev.cash - randomStock.price * quantity),
        holdings: {
          ...prev.holdings,
          [randomStock.id]: (prev.holdings[randomStock.id] || 0) + quantity,
        },
      }));
    } else if (action === 'sell' && botPortfolio.holdings[randomStock.id] >= quantity) {
      setBotPortfolio(prev => ({
        ...prev,
        cash: prev.cash + randomStock.price * quantity,
        holdings: {
          ...prev.holdings,
          [randomStock.id]: Math.max(0, prev.holdings[randomStock.id] - quantity),
        },
      }));
    }
  };

  // Make bot trades when phase changes
  useEffect(() => {
    if (!isPhaseComplete) {
      // Make 2-4 random trades at the start of each phase
      const numberOfTrades = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < numberOfTrades; i++) {
        setTimeout(botTrade, i * 1000); // Stagger the trades by 1 second
      }
    }
  }, [currentPhase, isPhaseComplete]);

  const handlePlayerTrade = (stockId, action, quantity) => {
    const stock = stocks.find(s => s.id === stockId);
    if (!stock) return;

    // Calculate maximum quantity based on available cash or holdings
    let maxQuantity;
    if (action === 'buy') {
      maxQuantity = Math.floor(playerPortfolio.cash / stock.price);
    } else {
      maxQuantity = playerPortfolio.holdings[stockId] || 0;
    }
    
    // Ensure quantity is not more than max
    const safeQuantity = Math.min(quantity, maxQuantity);

    if (action === 'buy' && playerPortfolio.cash >= stock.price * safeQuantity) {
      setPlayerPortfolio(prev => ({
        ...prev,
        cash: Math.max(0, prev.cash - stock.price * safeQuantity),
        holdings: {
          ...prev.holdings,
          [stockId]: (prev.holdings[stockId] || 0) + safeQuantity,
        },
      }));
    } else if (action === 'sell' && playerPortfolio.holdings[stockId] >= safeQuantity) {
      setPlayerPortfolio(prev => ({
        ...prev,
        cash: prev.cash + stock.price * safeQuantity,
        holdings: {
          ...prev.holdings,
          [stockId]: Math.max(0, prev.holdings[stockId] - safeQuantity),
        },
      }));
    }
  };

  const handlePhaseComplete = () => {
    setIsPhaseComplete(true);
    // Update stock prices based on phase
    setStocks(prevStocks => 
      prevStocks.map(stock => ({
        ...stock,
        price: stock[`phase${currentPhase}Impact`].price,
      }))
    );
  };

  const handleNextPhase = () => {
    if (currentPhase < 3) {
      setCurrentPhase(prev => prev + 1);
      setIsPhaseComplete(false);
    } else {
      setShowResults(true);
    }
  };

  const calculatePortfolioValue = (portfolio) => {
    let total = portfolio.cash;
    Object.entries(portfolio.holdings).forEach(([stockId, quantity]) => {
      const stock = stocks.find(s => s.id === parseInt(stockId));
      if (stock) {
        total += stock.price * quantity;
      }
    });
    return total;
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Stock Trading Game</h1>
        <div className="phase-info">
          <h2>Phase {currentPhase}</h2>
          {currentPhase === 1 && <p>Global Pandemic Crisis</p>}
          {currentPhase === 2 && <p>Economic Recovery</p>}
          {currentPhase === 3 && <p>Market Transformation</p>}
        </div>
      </div>
      
      <div className="game-content">
        <StockMarket 
          stocks={stocks} 
          onTrade={handlePlayerTrade}
          playerCash={playerPortfolio.cash}
          playerPortfolio={playerPortfolio}
          currentPhase={currentPhase}
          isPhaseComplete={isPhaseComplete}
          onPhaseComplete={handlePhaseComplete}
          onNextPhase={handleNextPhase}
          showResults={showResults}
        />
        
        <div className="portfolios-container">
          <Portfolio 
            title="Your Portfolio"
            portfolio={playerPortfolio}
            stocks={stocks}
            calculateValue={calculatePortfolioValue}
          />
          <Portfolio 
            title="Bot Portfolio"
            portfolio={botPortfolio}
            stocks={stocks}
            calculateValue={calculatePortfolioValue}
          />
        </div>
        
        <Leaderboard 
          playerValue={calculatePortfolioValue(playerPortfolio)}
          botValue={calculatePortfolioValue(botPortfolio)}
        />
      </div>
    </div>
  );
};

export default Game; 