
import { useState,useEffect, useMemo } from 'react'
import './App.css'

function App() {
 
  const [cards,setCards] = useState([]);
  const [myScore,setMyScore] = useState(0);
  const [bestScore,setBestScore] = useState(0);
  const [clickedCards,setClickedCards] = useState([]);
  const [gameOver,setGameOver] = useState(false);
  const [statusMessage,setStatusMessage] = useState("");
  const [loading,setLoading] = useState(true);
  
  const fetchCards = async () => {
        try {
      const res = await fetch("https://rickandmortyapi.com/api/character?page=1");
      if (!res.ok) throw new Error("Could not fetch resource");
      const data = await res.json();
      const newCards = data.results.slice(0, 15).map(item => ({
        id: item.id,
        name: item.name,
        img: item.image,
      }));
      setCards(newCards);
    } catch (error) {
      console.error(error);
      setStatusMessage("Failed to load cards.");
      setGameOver(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchCards();
  },[]);

  const shuffledCards = useMemo(()=>{
    if(cards.length===0) return [];
    let result;
     do{
    result = [...cards].sort(()=>Math.random() - 0.5).slice(0,10);
    }
   while(result.every( card => clickedCards.some(clicked => clicked.id === card.id)) && clickedCards.length < 15);
   return result;
  },[cards,clickedCards]);
  
  useEffect(()=>{
    if(clickedCards.length===15){
      setStatusMessage("You Won! Click Restart to play again.");
      setGameOver(true);
    }
  },[clickedCards]);

  const handleClick = (card) => {
  if(gameOver) return;

  const alreadyClicked = clickedCards.some(c => c.id === card.id);
    if(alreadyClicked)
    {
      if(myScore > bestScore){
        setBestScore(myScore);
      }
      
      setStatusMessage("Game Over! Click Restart to play again.");
      setGameOver(true);
    }
    else{
    setClickedCards(prev => [...prev,card]);
    setMyScore(prev => prev + 1);
  }
  };
  const restartGame = async () => {
  setMyScore(0);
  setClickedCards([]);
  setGameOver(false);
  setStatusMessage('');
  setLoading(true);
  await fetchCards();
  }
  if (loading) return <p className="loading">Loading cards...</p>;
  return (
    <>
      <header>
        <div className="heading">Memory Game</div>
        <div className="scores">
          <div className="myScore"><p>my score : <span>{myScore}</span> </p></div>
          <div className="bestScore"><p>best score : <span>{bestScore}</span></p></div>
        </div>
        </header>
         

<div className="wrapper">
  {gameOver && (<div className = "statusMessage">
        <p style={{fontSize: '28px',fontWeight: 'bold',letterSpacing: '1px'}}>{statusMessage}</p>
        <button onClick ={restartGame}> Restart </button>
        </div>)}
      <div className='cardGrid'>
        {!gameOver && shuffledCards.map(card => (
          <div key = {card.id} className="card" onClick={() => handleClick(card)}>
            <img src={card.img} alt={card.name} />
            {/* <h3>{card.name}</h3> */}
          </div>
        ))}
      </div>
      </div>
    </>
  )
}

export default App
