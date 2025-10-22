import React from 'react';
import { decorateHint } from '../utils/decorateHint.tsx';
import { data } from '../data';

const HintExample: React.FC = () => {


  return (
    <div>
      <h2>Hint Examples from Data</h2>
      <div>
        {data.map((card) => (
          <div key={card.id} style={{ marginBottom: '28px' }}>
            <div>
              <strong>Word:</strong>
              {card.front}
            </div>
            <div>
              <strong>Hint:</strong>
              {card.hint}
            </div>
            <div>
              <strong>Decorated result:</strong>
              {decorateHint(card.front.toLowerCase(), card.hint)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HintExample;
