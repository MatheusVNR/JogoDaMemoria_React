import React, { useState, useEffect } from 'react';
import Card from './components/Card';
import './App.css';

type CardType = {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const createCards = (): CardType[] => {
  const values = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  let cards: CardType[] = [];

  values.forEach((value, index) => {
    cards.push({ id: index * 2, value, isFlipped: false, isMatched: false });
    cards.push({ id: index * 2 + 1, value, isFlipped: false, isMatched: false });
  });

  return shuffle(cards);
};

const shuffle = (array: CardType[]) => {
  let currentIndex = array.length, randomIndex, temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

const App: React.FC = () => {
  const [cards, setCards] = useState<CardType[]>(createCards());
  const [firstCard, setFirstCard] = useState<CardType | null>(null);
  const [secondCard, setSecondCard] = useState<CardType | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);

  // Temporizador
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!gameFinished) {
      timer = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameFinished]);

  const handleCardClick = (card: CardType) => {
    if (disabled) return;
    if (card.isFlipped || card.isMatched) return;

    const flippedCard = { ...card, isFlipped: true };

    setCards(prev =>
      prev.map(c => (c.id === card.id ? flippedCard : c))
    );

    if (!firstCard) {
      setFirstCard(flippedCard);
    } else if (!secondCard) {
      setSecondCard(flippedCard);
      setDisabled(true);
      setMoves(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (firstCard && secondCard) {
      if (firstCard.value === secondCard.value) {
        // Encontrou par
        setCards(prev =>
          prev.map(c =>
            c.value === firstCard.value ? { ...c, isMatched: true } : c
          )
        );
        resetTurn();
      } else {
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.id === firstCard.id || c.id === secondCard.id
                ? { ...c, isFlipped: false }
                : c
            )
          );
          resetTurn();
        }, 1000);
      }
    }
  }, [firstCard, secondCard]);

  const resetTurn = () => {
    setFirstCard(null);
    setSecondCard(null);
    setDisabled(false);
  };

  const handleRestart = () => {
    setCards(shuffle(createCards()));
    resetTurn();
    setMoves(0);
    setTime(0);
    setGameFinished(false);
  };

  // Checa se o jogo acabou
  useEffect(() => {
    if (cards.length && cards.every(card => card.isMatched)) {
      setGameFinished(true);
    }
  }, [cards]);

  // Formata o tempo em mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}m:${s}s`;
  };

  return (
    <div className="app-container">
      <header>
        <h1>Jogo da Memória</h1>
        <div className="stats">
          <span>Jogadas: {moves}</span>
          <span>Tempo: {formatTime(time)}</span>
        </div>
        <button className="restart-button" onClick={handleRestart}>
          Reiniciar
        </button>
      </header>

      <main className="game-board">
        {cards.map(card => (
          <Card key={card.id} card={card} onClick={() => handleCardClick(card)} />
        ))}
      </main>

      {gameFinished && (
        <div className="modal">
          <div className="modal-content">
            <h2>Parabéns!</h2>
            <p>Você concluiu o jogo em {moves} jogadas. Tempo: {formatTime(time)}.</p>
            <button className="restart-button" onClick={handleRestart}>
              Jogar Novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;