import React, { useState, useEffect } from 'react'

export default function Creation() {
    const [stats, setStats] = useState({
        int: 5,
        str: 5,
        dex: 5,
        sag: 5,
        con: 5,
      });
    
      const handleIncrement = (stat) => {
        if (totalPointsUsed() < 5) {
          setStats({ ...stats, [stat]: stats[stat] + 1 });
        }
      };
    
      const handleDecrement = (stat) => {
        if (stats[stat] > 5) {
          setStats({ ...stats, [stat]: stats[stat] - 1 });
        }
      };
    
      useEffect(() => {
        localStorage.setItem('currentCharacterStats', JSON.stringify(stats));
      }, [stats]);

      const totalPointsUsed = () => {
        return Object.values(stats).reduce((total, stat) => total + stat - 5, 0); // Subtract initial value (2) from each stat
      };
    
      return (
        <div>
          <div className="stat-row">
            <div className="stat">
              <label htmlFor="int">Intelligence:</label>
              <button onClick={() => handleDecrement('int')}>-</button>
              {stats['int']}
              <button onClick={() => handleIncrement('int')}>+</button>
            </div>
            <div className="stat">
              <label htmlFor="str">Strength:</label>
              <button onClick={() => handleDecrement('str')}>-</button>
              {stats['str']}
              <button onClick={() => handleIncrement('str')}>+</button>
            </div>
            <div className="stat">
              <label htmlFor="dex">Dexterity:</label>
              <button onClick={() => handleDecrement('dex')}>-</button>
              {stats['dex']}
              <button onClick={() => handleIncrement('dex')}>+</button>
            </div>
            <div className="stat">
              <label htmlFor="sag">Wisdom:</label>
              <button onClick={() => handleDecrement('sag')}>-</button>
              {stats['sag']}
              <button onClick={() => handleIncrement('sag')}>+</button>
            </div>
            <div className="stat">
              <label htmlFor="con">Constitution:</label>
              <button onClick={() => handleDecrement('con')}>-</button>
              {stats['con']}
              <button onClick={() => handleIncrement('con')}>+</button>
            </div>
          </div>
          <div>Total Points Remaining: {5 - totalPointsUsed()}</div>
        </div>
      );
}