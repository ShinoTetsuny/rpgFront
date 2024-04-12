import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, useParams } from 'react-router-dom';

const styles = {
  detailsContainer: {
    padding: '20px',
  },
  button: {
    marginRight: '10px',
  },
};

function MobDetails() {
  const { id } = useParams();
  const [mob, setMob] = useState(null);
  const [editMob, setEditMob] = useState({ nameMob: '', strMob: 0, dexMob: 0, sagMob: 0, conMob: 0, intMob: 0 });
  const [isEditing, setIsEditing] = useState(false);

  const fetchMobDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/mob/${id}`);
      setMob(res.data);
      setEditMob({ nameMob: res.data.nameMob, strMob: res.data.strMob, dexMob: res.data.dexMob, sagMob: res.data.sagMob, conMob: res.data.conMob, intMob: res.data.intMob });
    } catch (error) {
      console.error('Error fetching Mob details:', error);
    }
  };

  const handleEditMob = async () => {
    try {
      await axios.put(`http://localhost:3000/mob/${id}`, editMob);
      setIsEditing(false);
      fetchMobDetails();
    } catch (error) {
      console.error('Error editing mob:', error);
    }
  };

  const handleDeleteMob = async () => {
    try {
      await axios.delete(`http://localhost:3000/mob/${id}`);
      Navigate('/backoffice');
    } catch (error) {
      console.error('Error deleting mob:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    fetchMobDetails();
  }, [id]);

  return (
    <div style={styles.detailsContainer}>
      {mob ? (
        <div>
          <h1>Détails du mob :</h1>
          {isEditing ? (
            <div>
              <label>Nom :</label>
              <input
                type="text"
                value={editMob.nameMob}
                onChange={(e) => setEditMob({ ...editMob, nameMob: e.target.value })}
              />
              <label>STR :</label>
              <input
                type="number"
                value={editMob.strMob}
                onChange={(e) => setEditMob({ ...editMob, strMob: parseInt(e.target.value) })}
              />
              <label>DEX :</label>
              <input
                type="number"
                value={editMob.dexMob}
                onChange={(e) => setEditMob({ ...editMob, dexMob: parseInt(e.target.value) })}
              />
              <label>SAG :</label>
              <input
                type="number"
                value={editMob.sagMob}
                onChange={(e) => setEditMob({ ...editMob, sagMob: parseInt(e.target.value) })}
              />
              <label>CON :</label>
              <input
                type="number"
                value={editMob.conMob}
                onChange={(e) => setEditMob({ ...editMob, conMob: parseInt(e.target.value) })}
              />
              <label>INT :</label>
              <input
                type="number"
                value={editMob.intMob}
                onChange={(e) => setEditMob({ ...editMob, intMob: parseInt(e.target.value) })}
              />
              <button style={styles.button} onClick={handleEditMob}>
                Enregistrer
              </button>
              <button style={styles.button} onClick={handleCancelEdit}>
                Annuler
              </button>
            </div>
          ) : (
            <div>
              <p><strong>Nom :</strong> {mob.nameMob}</p>
              <p><strong>STR :</strong> {mob.strMob}</p>
              <p><strong>DEX :</strong> {mob.dexMob}</p>
              <p><strong>SAG :</strong> {mob.sagMob}</p>
              <p><strong>CON :</strong> {mob.conMob}</p>
              <p><strong>INT :</strong> {mob.intMob}</p>
              <button style={styles.button} onClick={() => setIsEditing(true)}>
                Modifier le Mob
              </button>
              <button style={styles.button} onClick={handleDeleteMob}>
                Supprimer le Mob
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

export default MobDetails;
