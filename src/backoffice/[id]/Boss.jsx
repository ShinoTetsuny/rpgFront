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

function BossDetails() {
  const { id } = useParams();
  const [boss, setBoss] = useState(null);
  const [editBoss, setEditBoss] = useState({ nameBoss: "", strBoss: 0, dexBoss: 0, sagBoss: 0, conBoss: 0,intBoss: 0, dmgRangeBoss: '', dmgCDBoss: 0});
  const [isEditing, setIsEditing] = useState(false);

  const fetchBossDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/boss/${id}`);
      setBoss(res.data);
      setEditBoss({ nameBoss: res.data.nameBoss, strBoss: res.data.strBoss, dexBoss: res.data.dexBoss, sagBoss: res.data.sagBoss, conBoss: res.data.conBoss,intBoss: res.data.intBoss, dmgRangeBoss: res.data.dmgRangeBoss, dmgCDBoss: res.data.dmgCDBoss });
    } catch (error) {
      console.error('Error fetching Boss details:', error);
    }
  };

  const handleEditBoss = async () => {
    try {
      await axios.put(`http://localhost:3000/boss/${id}`, editBoss);
      setIsEditing(false);
      fetchBossDetails();
    } catch (error) {
      console.error('Error editing boss:', error);
    }
  };

  const handleDeleteBoss = async () => {
    try {
      await axios.delete(`http://localhost:3000/boss/${id}`);
      Navigate('/backoffice');
    } catch (error) {
      console.error('Error deleting boss:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    fetchBossDetails();
  }, [id]);

  return (
    <div style={styles.detailsContainer}>
      {boss ? (
        <div>
          <h1>Détails du boss :</h1>
          {isEditing ? (
            <div>
              <label>Nom :</label>
              <input
                type="text"
                value={editBoss.nameBoss}
                onChange={(e) => setEditBoss({ ...editBoss, nameBoss: e.target.value })}
              />
              <label>STR :</label>
              <input
                type="number"
                value={editBoss.strBoss}
                onChange={(e) => setEditBoss({ ...editBoss, strBoss: parseInt(e.target.value) })}
              />
              <label>DEX :</label>
              <input
                type="number"
                value={editBoss.dexBoss}
                onChange={(e) => setEditBoss({ ...editBoss, dexBoss: parseInt(e.target.value) })}
              />
              <label>SAG :</label>
              <input
                type="number"
                value={editBoss.sagBoss}
                onChange={(e) => setEditBoss({ ...editBoss, sagBoss: parseInt(e.target.value) })}
              />
              <label>CON :</label>
              <input
                type="number"
                value={editBoss.conBoss}
                onChange={(e) => setEditBoss({ ...editBoss, conBoss: parseInt(e.target.value) })}
              />
              <label>INT :</label>
              <input
                type="number"
                value={editBoss.intBoss}
                onChange={(e) => setEditBoss({ ...editBoss, intBoss: parseInt(e.target.value) })}
              />
              <label>Range Damage :</label>
              <input
                type="text"
                value={editBoss.dmgRangeBoss}
                onChange={(e) => setEditBoss({ ...editBoss, dmgRangeBoss: e.target.value })}
              />
              <label>CDR :</label>
              <input
                type="number"
                value={editBoss.dmgCDBoss}
                onChange={(e) => setEditBoss({ ...editBoss, dmgCDBoss: parseInt(e.target.value) })}
              />
              <button style={styles.button} onClick={handleEditBoss}>
                Enregistrer
              </button>
              <button style={styles.button} onClick={handleCancelEdit}>
                Annuler
              </button>
            </div>
          ) : (
            <div>
              <p><strong>Nom :</strong> {boss.nameBoss}</p>
              <p><strong>STR :</strong> {boss.strBoss}</p>
              <p><strong>DEX :</strong> {boss.dexBoss}</p>
              <p><strong>SAG :</strong> {boss.sagBoss}</p>
              <p><strong>CON :</strong> {boss.conBoss}</p>
              <p><strong>INT :</strong> {boss.intBoss}</p>
              <p><strong>Range Damage :</strong> {boss.dmgRangeBoss}</p>
              <p><strong>CDR :</strong> {boss.dmgCDBoss}</p>
              <button style={styles.button} onClick={() => setIsEditing(true)}>
                Modifier le Boss
              </button>
              <button style={styles.button} onClick={handleDeleteBoss}>
                Supprimer le Boss
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
