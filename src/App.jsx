import { useState } from 'react'
import Creation from './Components/Creation'
import Weapon from './Components/Weapon'
import './styles/App.css'
import { Link } from 'react-router-dom';

function App() {

    if (!localStorage.getItem('currentCharacterStats') && !localStorage.getItem('currentCharacterWeapon')) {
        localStorage.setItem('currentCharacterStats', JSON.stringify({ int: 0, str: 0, dex: 0, sag: 0, con: 0 }));
        localStorage.setItem('currentCharacterWeapon', JSON.stringify({ name: 'Rien', damage: '0-0', cooldown: '0', type: 'Physical' }));
    }
    const [showWarning, setShowWarning] = useState(false);

    const handleSaveCharacter = () => {
      const stats = JSON.parse(localStorage.getItem('currentCharacterStats'));
      const selectedWeapon = localStorage.getItem('currentCharacterWeapon');
      
      if (!stats || !selectedWeapon) {
        setShowWarning(true);
        console.log(selectedWeapon, 'test weapon')
        return;
      }
  
      const totalPointsUsed = Object.values(stats).reduce((total, stat) => total + stat, 0) - 10; // subtracting the initial 2 points per stat
      if (totalPointsUsed !== 5) {
        setShowWarning(true);
        console.log(totalPointsUsed, 'test totalPointsUsed')
        return;
      }
      
      setShowWarning(false);
    };

    return (
        <>
            <h1>Création de personnage</h1>
            <Creation />
            <h1>Choix de l'arme</h1>
            <Weapon />
            {showWarning && (
            <div className="warning">Please allocate all stat points and select a weapon before saving.</div>
            )}
            <button onClick={handleSaveCharacter}><Link to="/combat">Au combat!</Link></button>
        </>
    )
}

export default App
