import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, useParams, redirect } from 'react-router-dom';

const styles = {
  detailsContainer: {
    padding: '20px',
  },
  button: {
    marginRight: '10px',
  },
};

function BossDetails() {
  const { id } = useParams();
  const [weapon, setWeapon] = useState(null);
  const [editWeapon, setEditWeapon] = useState({ nameWeapon: '', dmgRangeWeapon: '', dmgCDWeapon: 0, type: ''});
  const [isEditing, setIsEditing] = useState(false);

  const fetchWeaponDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/weapon/${id}`);
      setWeapon(res.data);
      setEditWeapon({ nameWeapon: res.data.nameWeapon, dmgRangeWeapon: res.data.dmgRangeWeapon, dmgCDWeapon: res.data.dmgCDWeapon, type: res.data.type });
    } catch (error) {
      console.error('Error fetching Weapon details:', error);
    }
  };

  const handleEditEngine = async () => {
    try {
      await axios.put(`http://localhost:3000/weapon/${id}`, editWeapon);
      setIsEditing(false);
      fetchWeaponDetails();
    } catch (error) {
      console.error('Error editing engine:', error);
    }
  };

  const handleDeleteEngine = async () => {
    try {
      await axios.delete(`http://localhost:3000/weapon/${id}`);
      // Utilisez la méthode `Navigate` ici à l'intérieur du composant
      Navigate('/backoffice');
    } catch (error) {
      console.error('Error deleting weapon:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    fetchWeaponDetails();
  }, [id]);

  return (
    <div style={styles.detailsContainer}>
      {weapon ? (
        <div>
          <h1>Détails de l'arme :</h1>
          {isEditing ? (
            <div>
              <label>Nom :</label>
              <input
                type="text"
                value={editWeapon.nameWeapon}
                onChange={(e) => setEditWeapon({ ...editWeapon, nameWeapon: e.target.value })}
              />
              <label>Range Weapon :</label>
              <input
                type="number"
                value={editWeapon.dmgRangeWeapon}
                onChange={(e) => setEditWeapon({ ...editWeapon, dmgRangeWeapon: e.target.value })}
              />
              <label>CDR Weapon :</label>
              <input
                type="text"
                value={editWeapon.dmgCDWeapon}
                onChange={(e) => setEditWeapon({ ...editWeapon, dmgCDWeapon: e.target.value })}
              />
              <label>Type :</label>
              <input
                type="text"
                value={editWeapon.type}
                onChange={(e) => setEditWeapon({ ...editWeapon, type: e.target.value })}
              />
              <button style={styles.button} onClick={handleEditEngine}>
                Enregistrer
              </button>
              <button style={styles.button} onClick={handleCancelEdit}>
                Annuler
              </button>
            </div>
          ) : (
            <div>
              <p><strong>Nom :</strong> {engine.name}</p>
              <p><strong>Type :</strong> {engine.type}</p>
              <button style={styles.button} onClick={() => setIsEditing(true)}>
                Modifier l'Engine
              </button>
              <button style={styles.button} onClick={handleDeleteEngine}>
                Supprimer l'Engine
              </button>
            </div>
          )}
        </div>
      ) : (
        <h1>Chargement...</h1>
      )}
    </div>
  );
}

export default BossDetails;
