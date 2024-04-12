import { useState, useEffect } from 'react'
import  axios  from 'axios'
import { Link } from 'react-router-dom';


function BackOffice() {
    const [load, setLoad] = useState(false)

    const [mob, setMob] = useState([])
    const [boss, setBoss] = useState([])
    const [weapon, setWeapon] = useState([])

    const [newMob, setNewMob] = useState({ nameMob: '', strMob: 0, dexMob: 0, sagMob: 0, conMob: 0, intMob: 0});
    const [newBoss, setNewBoss] = useState({ nameBoss: "", strBoss: 0, dexBoss: 0, sagBoss: 0, conBoss: 0,intBoss: 0, dmgRangeBoss: '', dmgCDBoss: 0});
    const [newWeapon, setNewWeapon] = useState({ nameWeapon: '', dmgRangeWeapon: '', dmgCDWeapon: 0, type: 'Physical'});

    const fetchMobs = async () => {
        try {
            const res = await axios.get('http://localhost:3000/mob');
            setMob(res.data);
        } catch (error) {
            console.error('Error fetching Mobs:', error);
        }
    }
    const fetchBoss = async () => {
        try {
            const res = await axios.get('http://localhost:3000/boss');
            setBoss(res.data);
        } catch (error) {
            console.error('Error fetching Boss:', error);
        }
    }
    const fetchWeapon = async () => {
        try {
            const res = await axios.get('http://localhost:3000/weapon');
            setWeapon(res.data);
        } catch (error) {
            console.error('Error fetching Weapon:', error);
        }
    }

    const createMob = async () => {
        try {
            await axios.post('http://localhost:3000/mob', newMob);
            fetchMobs();
            setNewMob({ nameMob: '', strMob: 0, dexMob: 0, sagMob: 0, conMob: 0, intMob: 0});
          } catch (error) {
            console.error('Error creating Mob:', error);
          }
    }

    const createBoss = async () => {
        try {
            await axios.post('http://localhost:3000/boss', newBoss);
            fetchBoss();
            setNewBoss({ nameBoss: "", strBoss: 0, dexBoss: 0, sagBoss: 0, conBoss: 0,intBoss: 0, dmgRangeBoss: '', dmgCDBoss: 0});
          } catch (error) {
            console.error('Error creating Mob:', error);
          }
    }

    const createWeapon = async () => {
        try {
            await axios.post('http://localhost:3000/weapon', newWeapon);
            fetchWeapon();
            setNewWeapon({ nameWeapon: '', dmgRangeWeapon: '', dmgCDWeapon: 0, type: 'Physical'});
          } catch (error) {
            console.error('Error creating Mob:', error);
          }
    }

    useEffect(() => {
        const fetchData = async () => {
          try {
            await Promise.all([fetchMobs(), fetchBoss(), fetchWeapon(), ]);
            setLoad(true);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchData();
      }, []);

  return (
    <>
        <div>
            <h2>Mobs</h2>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Nom</th>
                        <th style={styles.th}>STR</th>
                        <th style={styles.th}>DEX</th>
                        <th style={styles.th}>SAG</th>
                        <th style={styles.th}>CON</th>
                        <th style={styles.th}>INT</th>
                    </tr>
                </thead>
            <tbody>
              {mob.map(mob => (
                <tr key={mob.idMob}>
                  <td style={styles.td}><Link to={`/backoffice/${mob.idMob}/mob`}>{mob.nameMob}</Link></td>
                  <td style={styles.td}>{mob.strMob}</td>
                  <td style={styles.td}>{mob.dexMob}</td>
                  <td style={styles.td}>{mob.sagMob}</td>
                  <td style={styles.td}>{mob.conMob}</td>
                  <td style={styles.td}>{mob.intMob}</td>
                </tr>
              ))}
            </tbody>
            </table>
            <form onSubmit={createMob}>
                <label>
                    Name:
                    <input type="text" value={newMob.nameMob} onChange={(e) => setNewMob({ ...newMob, nameMob: e.target.value })} />
                </label>
                <label>
                    Strength:
                    <input type="number" value={newMob.strMob} onChange={(e) => setNewMob({ ...newMob, strMob: parseInt(e.target.value) })} />
                </label>
                <label>
                    Dexterity:
                    <input type="number" value={newMob.dexMob} onChange={(e) => setNewMob({ ...newMob, dexMob: parseInt(e.target.value) })} />
                </label>
                <label>
                    Wisdom:
                    <input type="number" value={newMob.sagMob} onChange={(e) => setNewMob({ ...newMob, sagMob: parseInt(e.target.value) })} />
                </label>
                <label>
                    Constitution:
                    <input type="number" value={newMob.conMob} onChange={(e) => setNewMob({ ...newMob, conMob: parseInt(e.target.value) })} />
                </label>
                <label>
                    Intelligence:
                    <input type="number" value={newMob.intMob} onChange={(e) => setNewMob({ ...newMob, intMob: parseInt(e.target.value) })} />
                </label>
                <button type="submit">Add Mob</button>
            </form>
        </div>
        <div>
            <h2>Boss</h2>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Nom</th>
                        <th style={styles.th}>STR</th>
                        <th style={styles.th}>DEX</th>
                        <th style={styles.th}>SAG</th>
                        <th style={styles.th}>CON</th>
                        <th style={styles.th}>INT</th>
                        <th style={styles.th}>Dégâts</th>
                        <th style={styles.th}>CDR Weapon</th>
                    </tr>
                </thead>
                <tbody>
                    {boss.map(boss => (
                        <tr key={boss.idBoss}>
                            <td style={styles.td}><Link to={`/backoffice/${boss.idBoss}/boss`}>{boss.nameBoss}</Link></td>
                            <td style={styles.td}>{boss.strBoss}</td>
                            <td style={styles.td}>{boss.dexBoss}</td>
                            <td style={styles.td}>{boss.sagBoss}</td>
                            <td style={styles.td}>{boss.conBoss}</td>
                            <td style={styles.td}>{boss.intBoss}</td>
                            <td style={styles.td}>{boss.dmgRangeBoss}</td>
                            <td style={styles.td}>{boss.dmgCDBoss}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form onSubmit={createBoss}>
                <label>
                    Name:
                    <input type="text" value={newBoss.nameBoss} onChange={(e) => setNewBoss({ ...newBoss, nameBoss: e.target.value })} />
                </label>
                <label>
                    Strength:
                    <input type="number" value={newBoss.strBoss} onChange={(e) => setNewBoss({ ...newBoss, strBoss: parseInt(e.target.value) })} />
                </label>
                <label>
                    Dexterity:
                    <input type="number" value={newBoss.dexBoss} onChange={(e) => setNewBoss({ ...newBoss, dexBoss: parseInt(e.target.value) })} />
                </label>
                <label>
                    Wisdom:
                    <input type="number" value={newBoss.sagBoss} onChange={(e) => setNewBoss({ ...newBoss, sagBoss: parseInt(e.target.value) })} />
                </label>
                <label>
                    Constitution:
                    <input type="number" value={newBoss.conBoss} onChange={(e) => setNewBoss({ ...newBoss, conBoss: parseInt(e.target.value) })} />
                </label>
                <label>
                    Intelligence:
                    <input type="number" value={newBoss.intBoss} onChange={(e) => setNewBoss({ ...newBoss, intBoss: parseInt(e.target.value) })} />
                </label>
                <label>
                    Damage Range:
                    <input type="text" value={newBoss.dmgRangeBoss} onChange={(e) => setNewBoss({ ...newBoss, dmgRangeBoss: e.target.value })} />
                </label>
                <label>
                    Damage Cooldown:
                    <input type="number" value={newBoss.dmgCDBoss} onChange={(e) => setNewBoss({ ...newBoss, dmgCDBoss: parseInt(e.target.value) })} />
                </label>
                <button type="submit">Add Boss</button>
            </form>
        </div>
        <div>
            <h2>Weapons</h2>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Nom</th>
                        <th style={styles.th}>Dégâts</th>
                        <th style={styles.th}>CDR Weapon</th>
                        <th style={styles.th}>Type</th>
                    </tr>
                </thead>
                <tbody>
                    {weapon.map(weapon => (
                        <tr key={weapon.idWeapon}>
                            <td style={styles.td}><Link to={`/backoffice/${weapon.idWeapon}/weapon`}>{weapon.nameWeapon}</Link></td>
                            <td style={styles.td}>{weapon.dmgRangeWeapon}</td>
                            <td style={styles.td}>{weapon.dmgCDWeapon}</td>
                            <td style={styles.td}>{weapon.type}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form onSubmit={createWeapon}>
                <label>
                    Name:
                    <input type="text" value={newWeapon.nameWeapon} onChange={(e) => setNewWeapon({ ...newWeapon, nameWeapon: e.target.value })} />
                </label>
                <label>
                    Damage Range:
                    <input type="text" value={newWeapon.dmgRangeWeapon} onChange={(e) => setNewWeapon({ ...newWeapon, dmgRangeWeapon: e.target.value })} />
                </label>
                <label>
                    Damage Cooldown:
                    <input type="number" value={newWeapon.dmgCDWeapon} onChange={(e) => setNewWeapon({ ...newWeapon, dmgCDWeapon: parseInt(e.target.value) })} />
                </label>
                <label>
                    Type:
                    <select value={newWeapon.type} onChange={(e) => setNewWeapon({ ...newWeapon, type: e.target.value })}>
                        <option value="Physical">Physical</option>
                        <option value="Magical">Magical</option>
                    </select>
                </label>
                <button type="submit">Add Weapon</button>
            </form>
        </div>
    </>
  )
}

export default BackOffice

const styles = {
    dashboardContainer: {
      padding: '20px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
    },
    th: {
      backgroundColor: '#f2f2f2',
      padding: '8px',
      textAlign: 'left',
      border: '1px solid #ddd',
    },
    td: {
      padding: '8px',
      textAlign: 'left',
      border: '1px solid #ddd',
    },
    formContainer: {
      margin: '20px 0',
    },
    formLabel: {
      marginBottom: '8px',
      display: 'block',
    },
    formSelect: {
      marginBottom: '16px',
      width: '100%',
      padding: '8px',
      boxSizing: 'border-box',
    },
    formButton: {
      backgroundColor: '#4caf50',
      color: 'white',
      padding: '10px 15px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };