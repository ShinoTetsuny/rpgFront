import React, { useState } from 'react';

export default function Weapon() {
    const [selectedWeapon, setSelectedWeapon] = useState('');
    const weapons = [
        { name: 'Sword', damage: '5-10', cooldown: '3', type: 'Physical' },
        { name: 'Bow', damage: '3-7', cooldown: '2.5', type: 'Physical' },
        { name: 'Staff', damage: '2-5', cooldown: '1.5', type: 'Magical' },
        { name: 'Dagger', damage: '4-6', cooldown: '2', type: 'Physical' },
        { name: 'Axe', damage: '6-8', cooldown: '3.5', type: 'Physical' },
        { name: 'Mace', damage: '7-9', cooldown: '4', type: 'Physical' },
        { name: 'Spear', damage: '8-11', cooldown: '3.5', type: 'Physical' },
        { name: 'Hammer', damage: '9-12', cooldown: '5', type: 'Physical' }
    ];
  
    const handleWeaponChange = (event) => {
        setSelectedWeapon(event.target.value);
        localStorage.setItem('currentCharacterWeapon', JSON.stringify(weapons.find((weapon) => weapon.name === event.target.value))); // Save selected weapon stats to local storage
    };
  
    return (
        <div className="weapon-container">
          <h2>Select a Weapon</h2>
          <div className="weapon-groups">
            {weapons.map((weapon, index) => (
              <div key={index} className="weapon-group">
                <input
                  type="radio"
                  id={weapon.name}
                  name="weapon"
                  value={weapon.name}
                  checked={selectedWeapon === weapon.name}
                  onChange={handleWeaponChange}
                />
                <label htmlFor={weapon.name}>
                  {weapon.name} - Damage: {weapon.damage}, Cooldown: {weapon.cooldown}, Type: {weapon.type}
                </label>
              </div>
            ))}
          </div>
          {selectedWeapon && (
            <div className="weapon-details">
              <h3>{selectedWeapon}</h3>
              {weapons.find((weapon) => weapon.name === selectedWeapon) && (
                <p>
                  Damage: {weapons.find((weapon) => weapon.name === selectedWeapon).damage}
                </p>
              )}
              {weapons.find((weapon) => weapon.name === selectedWeapon) && (
                <p>
                  Cooldown: {weapons.find((weapon) => weapon.name === selectedWeapon).cooldown}
                </p>
              )}
              {weapons.find((weapon) => weapon.name === selectedWeapon) && (
                <p>
                  Type: {weapons.find((weapon) => weapon.name === selectedWeapon).type}
                </p>
              )}
            </div>
          )}
        </div>
      );
}