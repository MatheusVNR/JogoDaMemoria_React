import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

type CardProps = {
  card: {
    id: number;
    value: string;
    isFlipped: boolean;
    isMatched: boolean;
  };
  onClick: () => void;
};

const Card: React.FC<CardProps> = ({ card, onClick }) => {
  return (
    <div className="card" onClick={onClick}>
      <motion.div
        className="card-inner"
        animate={{ rotateY: card.isFlipped || card.isMatched ? 0 : 180 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card-front">
          {card.value}
        </div>
        <div className="card-back">
          ?
        </div>
      </motion.div>
    </div>
  );
};

export default Card;