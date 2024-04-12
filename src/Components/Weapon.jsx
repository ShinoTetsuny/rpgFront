import React, { useEffect, useState } from 'react';
import axios from 'axios';

let rendered = false;

export default function Weapon() {
    const [selectedWeapon, setSelectedWeapon] = useState('');
    const [weapons, setWeapons] = useState([]);

    const fetchWeapon = async () => {
        try {
            const res = await axios.get('http://localhost:3000/weapon');
            return res.data;
        } catch (error) {
            console.error('Error fetching Weapon:', error);
        }
    }
    useEffect(() => {
        const getWeapons = async () => {
            const weaponsFromServer = await fetchWeapon();
            weaponsFromServer.map((weapon) => {
                let tempWeapon = {
                    name: weapon.nameWeapon,
                    damage: weapon.dmgRangeWeapon,
                    cooldown: weapon.dmgCDWeapon,
                    type: weapon.type
                }
                setWeapons((weapons) => [...weapons, tempWeapon]);
            });
        }
        !rendered ? getWeapons() : console.log('Already rendered weapons');
        rendered = true;
    }, []);

    console.log(weapons);
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