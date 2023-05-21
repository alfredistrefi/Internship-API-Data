import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import './App.css';

function CatFactDetails() {
  const navigate = useNavigate();
  const { index } = useParams();
  const factIndex = parseInt(index, 10);
  const [facts, setFacts] = useState([]);

  useEffect(() => {
    const storedFacts = JSON.parse(localStorage.getItem('catFacts'));
    if (storedFacts) {
      setFacts(storedFacts);
    }
  }, []);

  const handleDelete = () => {
    const updatedFacts = facts.filter((_, idx) => idx !== factIndex);
    localStorage.setItem('catFacts', JSON.stringify(updatedFacts));
    navigate('/');
  };

  if (!facts || factIndex < 0 || factIndex >= facts.length) {
    return <div>Error: Fact not found.</div>;
  }

  const fact = facts[factIndex];

  return (
    <div className="fact-details">
      <h2>{fact.fact}</h2>
      <p>Length: {fact.length}</p>
      <button onClick={handleDelete} className="delete-button">
        Delete
      </button>
      <Link to="/" className="back-button">
        Back
      </Link>
    </div>
  );
}

function FactItem({ fact, index, isSelected }) {
  return (
    <li className={`fact-item ${isSelected ? 'selected' : ''}`}>
      <Link to={`/fact/${index}`}>{fact.fact}</Link>
    </li>
  );
}

function App() {
  const [facts, setFacts] = useState([]);
  const [selectedFactIndex, setSelectedFactIndex] = useState(null);

  useEffect(() => {
    fetchFacts();
  }, []);

  const fetchFacts = async () => {
    try {
      const response = await fetch('https://catfact.ninja/facts');
      const data = await response.json();
      setFacts(data.data);
      localStorage.setItem('catFacts', JSON.stringify(data.data));
    } catch (error) {
      console.log('Error fetching cat facts:', error);
    }
  };

  return (
    <Router>
      <div className="app">
        <h1 className="title">Cat Facts</h1>
        <ul className="fact-list">
          {facts.map((fact, index) => (
            <FactItem
              key={index}
              fact={fact}
              index={index}
              isSelected={index === selectedFactIndex}
            />
          ))}
        </ul>

        <Routes>
          <Route path="/fact/:index" element={<CatFactDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
