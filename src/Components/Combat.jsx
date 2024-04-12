import React, { useState, useEffect, useRef } from 'react'
import Countdown from 'react-countdown';
import { Link } from 'react-router-dom';
import '../styles/Combat.css';
import axios from 'axios';

    // Stat modifiers table
    const statModifiers = {
        int: {
            dmgmod: 1,
        },
        str: {
            dmgmod: 1,
        },
        dex: {
            phyres :2.0,
            physpd :0.01,
        },
        sag: {
            magres :2.0,
            magspd :0.01,
        },
        con: {
            phyres :1.0,
            magres :1.0,
        },
    };
    
    let lost = false;

    // Function to calculate modifiers for the player
    const calculatePlayerModifiers = (playerStats) => {
        const { int, str, dex, sag, con } = playerStats;
        return {
        phyAtk: Math.floor(str / 2) * statModifiers.str.dmgmod,
        magAtk: Math.floor(int / 2) * statModifiers.int.dmgmod,
        phySpd: statModifiers.dex.physpd * dex,
        magSpd: statModifiers.sag.magspd * sag,
        phyRes: Math.min(60, (statModifiers.dex.phyres * dex) + (statModifiers.con.phyres * con)),
        magRes: Math.min(60, (statModifiers.sag.magres * sag) + (statModifiers.con.magres * con)),
        };
    };
    
    // Function to calculate modifiers for the current mob/boss
    const calculateMobBossModifiers = (mobBossStats) => {
        const { int, str, dex, sag, con } = mobBossStats;
        return {
        phyAtk: Math.floor(str / 2) * statModifiers.str.dmgmod,
        magAtk: Math.floor(int / 2) * statModifiers.int.dmgmod,
        phySpd: statModifiers.dex.physpd * dex,
        magSpd: statModifiers.sag.magspd * sag,
        phyRes: Math.min(60, (statModifiers.dex.phyres * dex) + (statModifiers.con.phyres * con)),
        magRes: Math.min(60, (statModifiers.sag.magres * sag) + (statModifiers.con.magres * con)),
        };
    };

    const mobs = [];
    const bosses = [];
    const weapons = [];

    const fetchMobs = async () => {
        try {
            const res = await axios.get('http://localhost:3000/mob');
            return res.data;
        } catch (error) {
            console.error('Error fetching Mobs:', error);
        }
    }
    const fetchBoss = async () => {
        try {
            const res = await axios.get('http://localhost:3000/boss');
            return res.data;
        } catch (error) {
            console.error('Error fetching Boss:', error);
        }
    }

    const fetchWeapons = async () => {
        try {
            const res = await axios.get('http://localhost:3000/weapon');
            return res.data;
        } catch (error) {
            console.error('Error fetching Weapons:', error);
        }
    }

    let dtbMobs = await fetchMobs();
    let dtbBosses = await fetchBoss();
    let dtbWeapons = await fetchWeapons();

    console.log(dtbMobs);
    console.log(dtbBosses);


function generateMobBoss(){
    dtbMobs.map((mob) => {
        let tempMob = {
            name: mob.nameMob,
            stats: {
                int: mob.intMob,
                str: mob.strMob,
                dex: mob.dexMob,
                sag: mob.sagMob,
                con: mob.conMob
            }  
        }
        mobs.push(tempMob);
    });
    dtbBosses.map((boss) => {
        let tempBoss = {
            name: boss.nameBoss,
            stats: {
                int: boss.intBoss,
                str: boss.strBoss,
                dex: boss.dexBoss,
                sag: boss.sagBoss,
                con: boss.conBoss
            },
            damage: boss.dmgRangeBoss,
            cooldown: boss.dmgCDBoss,
            type: boss.typeBoss
        }
        bosses.push(tempBoss);
    });
}

function generateWeapons(){
    dtbWeapons.map((weapon) => {
        let tempWeapon = {
            name: weapon.nameWeapon,
            damage: weapon.dmgRangeWeapon,
            cooldown: weapon.dmgCDWeapon,
            type: weapon.type
        }
        weapons.push(tempWeapon);
    });
}

generateWeapons();
generateMobBoss();

    let mobBoss = {
        name : '',
        health : 0,
        fullhealth : 0,
        modifiers : {},
        timer : 0,
        fulltimer : 0,
        stats : {},
        damageRange : 0,
        atkType : ''
    };

    localStorage.getItem('currentFight') ? '' : localStorage.setItem('CurrentFight', 0);
    let currentFight = parseInt(localStorage.getItem('CurrentFight'));
    let bossFight = false;
    let player = {
        stats: { int: 2, str: 2, dex: 2, sag: 2, con: 2 },
        selectedWeapon: { name: 'Rien', damage: '0-0', cooldown: '0', type: 'Physical' },
        test : 'test'
    };
    if (localStorage.getItem('currentCharacterStats') !== null && localStorage.getItem('currentCharacterWeapon') !== null) {
        player= {stats : JSON.parse(localStorage.getItem('currentCharacterStats')), selectedWeapon : JSON.parse(localStorage.getItem('currentCharacterWeapon'))};
    }
    console.log(player);
    player.fullhealth = 10 + player.stats.con * 5;
    player.health = player.fullhealth;
    const playerWeaponDamage = player.selectedWeapon.damage;
    // Calculate modifiers for the player and mob/boss
    const playerModifiers = calculatePlayerModifiers(player.stats);
    let playerTimer = player.selectedWeapon.type === "Physical" ? Math.floor((parseInt(player.selectedWeapon.cooldown) - playerModifiers.phySpd * player.stats.dex)*100)/100 : Math.floor((parseInt(player.selectedWeapon.cooldown) - playerModifiers.magSpd * player.stats.sag)*100)/100;
    playerTimer <= 0 ? playerTimer = 0.5 : '';
    let playerFullTimer = playerTimer;
    // Function to select a random mob
    const selectRandomMob = () => {
        const randomMobIndex = Math.floor(Math.random() * mobs.length);
        const randomWeaponIndex = Math.floor(Math.random() * weapons.length);
        const currentMob = {mob : mobs[randomMobIndex]};
        currentMob.weapon = weapons[randomWeaponIndex];
        return currentMob;
    };

    // Function to select a random boss
    const selectRandomBoss = () => {
        const randomIndex = Math.floor(Math.random() * bosses.length);
        return bosses[randomIndex];
    };

    const handleAttackType = (atkDamage, atkType, attacker) => {
        let damage = 0;
        
        switch (atkType) {
        case "heavy":
            damage = atkDamage * 2;
            attacker === 'player' ? playerTimer = playerFullTimer * 1.25 : mobBoss.timer = mobBoss.fulltimer * 1.25;
            // attacker === 'player' ?document.getElementById('player-timer').date =Date.now() + (playerTimer * 1000) :document.getElementById('mob-boss-timer').date =Date.now() + (mobBoss.timer * 1000);
            break;
        case "light":
            damage = atkDamage / 2;
            attacker === 'player' ? playerTimer = playerFullTimer * 0.75 : mobBoss.timer = mobBoss.fulltimer * 0.75;
            // attacker === 'player' ?document.getElementById('player-timer').date =Date.now() + (playerTimer * 1000) :document.getElementById('mob-boss-timer').date =Date.now() + (mobBoss.timer * 1000);
            break;
        default:
            damage = atkDamage;
            attacker === 'player' ? playerTimer = playerFullTimer : mobBoss.timer = mobBoss.fulltimer;
            // attacker === 'player' ?document.getElementById('player-timer').date =Date.now() + (playerTimer * 1000) :document.getElementById('mob-boss-timer').date =Date.now() + (mobBoss.timer * 1000);
            break;
        }
        return damage;
    };

    const calculateDamage = (damageRange, modifier, atkType, attacker) => {
        let minDamage = parseInt(damageRange.split('-')[0]);
        let maxDamage = parseInt(damageRange.split('-')[1]);
        minDamage += modifier;
        maxDamage += modifier;
        let damage =  Math.floor(Math.random() * (maxDamage - minDamage + 1)) + minDamage;
        damage = handleAttackType(damage, atkType, attacker);
        return damage;
    };

    const options = [
        { name: 'light', weight: 2 },
        { name: 'normal', weight: 4 },
        { name: 'heavy', weight: 1 }
    ];
    
    const pickRandomOption = () => {
        // Calculate total weight
        const totalWeight = options.reduce((sum, option) => sum + option.weight, 0);

        // Generate a random number between 0 and totalWeight
        const randomNumber = Math.random() * totalWeight;

        // Iterate through options and pick the one that corresponds to the random number
        let accumulatedWeight = 0;
        for (const option of options) {
            accumulatedWeight += option.weight;
            if (randomNumber < accumulatedWeight) {
                return option.name;
                break;
            }
        }
    }
    function generateFight(){
        if (currentFight % 3 === 0 && currentFight !== 0) {
            const randomBoss = selectRandomBoss();
            mobBoss.name = randomBoss.name;
            mobBoss.stats = randomBoss.stats;
            mobBoss.modifiers = calculateMobBossModifiers(mobBoss.stats);
            bossFight = true;
            mobBoss.fullhealth = 10 + parseInt(randomBoss.stats.con) * 5;
            mobBoss.health = mobBoss.fullhealth;
            mobBoss.damageRange = randomBoss.damage;
            mobBoss.atkType = randomBoss.type;
            mobBoss.timer = mobBoss.atkType === "Physical" ? Math.floor((parseInt(randomBoss.cooldown) - mobBoss.modifiers.phySpd * mobBoss.stats.dex)*100)/100 : Math.floor((parseInt(randomBoss.cooldown) - mobBoss.modifiers.magSpd * mobBoss.stats.sag)*100)/100;
        }else{
            const randomMob = selectRandomMob();
            mobBoss.name = randomMob.mob.name;
            mobBoss.stats = randomMob.mob.stats;
            mobBoss.modifiers = calculateMobBossModifiers(mobBoss.stats);
            bossFight = false;
            mobBoss.fullhealth = 5 + parseInt(randomMob.mob.stats.con) * 5;
            mobBoss.health = mobBoss.fullhealth;
            mobBoss.damageRange = randomMob.weapon.damage;
            mobBoss.atkType = randomMob.weapon.type;
            mobBoss.timer = mobBoss.atkType === "Physical" ?Math.floor((parseInt(randomMob.weapon.cooldown) - mobBoss.modifiers.phySpd * mobBoss.stats.dex)*100)/100 : Math.floor((parseInt(randomMob.weapon.cooldown) - mobBoss.modifiers.magSpd * mobBoss.stats.sag)*100)/100;
            mobBoss.fulltimer = mobBoss.timer;
            console.log(mobBoss);
        }
        currentFight += 1;
};



const handleLose = () => {
    localStorage.setItem('CurrentFight', 0);
    currentFight = 0;
    lost = true;
};

let firstAttack = true;
let rendered = false;

export default function Combat() {
    const [playerHealth, setPlayerHealth] = useState(player.health);
    const [mobBossHealth, setMobBossHealth] = useState(mobBoss.health);
    const playerTimerActive = useRef();
    const mobBossTimerActive = useRef();
    const [deadMobBoss, setDeadMobBoss] = useState(true);
    const [turn, setTurn] = useState('player');

    function handlePlayerPause(){
        playerTimerActive.current.pause();
    };
    function handleMobBossPause(){
        mobBossTimerActive.current.pause();
    };
    function handlePlayerStart(){
        playerTimerActive.current.start();
    };
    function handleMobBossStart(){
        mobBossTimerActive.current.start();
    };

    const handlePlayerTimerFinish = () => {
        setTurn('player');
        handleMobBossPause(); // Pause timer 2 when timer 1 finishes
    };

    const handleMobBossTimerFinish = async () => {
        setTurn('mobBoss');
        handlePlayerPause(); // Pause timer 1 when timer 2 finishes
        await handleMobBossAttack();
        handlePlayerStart();
        handleMobBossStart();
    };

    useEffect(() => {
        if (deadMobBoss) {
            generateFight();
            setDeadMobBoss(false);
            rendered ? firstAttack = true : '';
        }
    },[deadMobBoss]);

    useEffect(() => {
        if (turn === 'player' && !lost) {
            document.getElementById('attack-buttons').style.border = '3px solid green';
        }else if (turn === 'mobBoss' && !lost){
            document.getElementById('attack-buttons').style.border = '3px solid red';
        }
    },[turn]);

    const handleAttack = (attacker, type) => {
        if (attacker === 'player') {
            if (player.selectedWeapon.type === "Physical") {
                let damage = calculateDamage(player.selectedWeapon.damage, playerModifiers.phyAtk, type, attacker);
                mobBoss.health -= Math.floor(damage - (parseInt(mobBoss.modifiers.phyRes) / 100) * damage);
                if (mobBoss.health < 0) {
                    mobBoss.health = 0;
                    setDeadMobBoss(true);
                }
                setMobBossHealth(mobBoss.health);
                
            }else{
                let damage = calculateDamage(player.selectedWeapon.damage, playerModifiers.magAtk, type, attacker);
                mobBoss.health -= Math.floor(damage - (parseInt(mobBoss.modifiers.magRes) / 100) * damage);
                if (mobBoss.health < 0) {
                    mobBoss.health = 0;
                    setDeadMobBoss(true);
                }
                setMobBossHealth(mobBoss.health);
            }
            
        }else{
            if (mobBoss.atkType === "Physical") {
                let damage = calculateDamage(mobBoss.damageRange, mobBoss.modifiers.phyAtk, mobBoss.atkType, attacker);
                console.log(playerModifiers);
                player.health -= Math.floor(damage - (parseInt(playerModifiers.phyRes) / 100) * damage);
                if (player.health < 0) {
                    player.health = 0;
                }
                turn === "mobBoss" ?setPlayerHealth(player.health):'';
                console.log('dmg to player', damage);
            }else{
                let damage = calculateDamage(mobBoss.damageRange, mobBoss.modifiers.magAtk, mobBoss.atkType, attacker);
                player.health -= Math.floor(damage - (parseInt(playerModifiers.magRes) / 100) * damage);
                if (player.health < 0) {
                    player.health = 0;
                }
                turn === "mobBoss" ?setPlayerHealth(player.health):'';
                console.log('dmg to player', damage);
            }
        }
        
    }

    const handleMobBossAttack = () => {
        handleAttack('mobBoss', pickRandomOption());
    };
    
    useEffect(() => {

        if (player.health <= 0) {
            handleLose();
        }else if (mobBoss.health <= 0) {
            setDeadMobBoss(true);
        }
        const playerHealthPercent = (player.health / player.fullhealth) * 100;
        const mobBossHealthPercent = (mobBoss.health / mobBoss.fullhealth) * 100;

        // Update health bar widths dynamically
        if (!lost) {
            document.getElementById('player-health-bar').style.width = `${playerHealthPercent}%`;
            document.getElementById('mob-boss-health-bar').style.width = `${mobBossHealthPercent}%`;
        }
    },[playerHealth, mobBossHealth, deadMobBoss]);
    

    const handleAttackClick = (attacker, type) => {
        if (turn === 'player'){
            handleAttack(attacker, type);
            if (firstAttack) {
                firstAttack = false;
                handleMobBossStart();
                handlePlayerStart();
            }else{
                handleMobBossStart();
                handlePlayerStart();
            };
        }
        setTurn('mobBoss');
        console.log(currentFight);
        localStorage.setItem('CurrentFight', currentFight);
    };

    rendered = true;

    if(!lost){
        return (
            <div id='battle-container'>
                <div className='battle-info'>
                    <div>
                        {bossFight ? <h3>Boss Timer</h3> : <h3>Mob Timer</h3>}
                        <div>
                            <Countdown
                                date={Date.now() + (mobBoss.timer * 1000)}
                                precision={2}
                                intervalDelay={0}
                                renderer={({seconds,milliseconds}) => {
                                    return <span id='mob-boss-timer'>{seconds}.{milliseconds}</span>;
                                }}
                                onComplete={handleMobBossTimerFinish}
                                onTick={() => {mobBoss.timer = mobBoss.timer - 0.01;}}
                                autoStart={false}
                                ref={mobBossTimerActive}
                            />
                        </div>
                        <h3>{mobBoss.name} Health: {mobBoss.health}</h3>
                        <div style={{ border: '1px solid black', width: '200px', marginBottom: '10px' }}>
                            <div id="mob-boss-health-bar" style={{ backgroundColor: 'red', width: '100%', height: '20px' }}></div>
                        </div>
                    </div>
                    <div>
                        <h3>Player Health: {player.health}</h3>
                        <div style={{ border: '1px solid black', width: '200px', marginBottom: '10px' }}>
                            <div id="player-health-bar" style={{ backgroundColor: 'green', width: '100%', height: '20px' }}></div>
                        </div>
                        <h3>Player Timer</h3>
                        <div>
                            <Countdown
                                date={Date.now() + (playerTimer * 1000)}
                                precision={2}
                                intervalDelay={0}
                                renderer={({seconds,milliseconds}) => {
                                    return <span id='player-timer'>{seconds}.{milliseconds}</span>;
                                }}
                                onComplete={handlePlayerTimerFinish}
                                onTick={() => {playerTimer = playerTimer - 0.01;}}
                                autoStart={false}
                                ref={playerTimerActive}
                            />
                        </div>
                    </div>
                </div>
                <div id="attack-buttons">
                    <button onClick={() => {handleAttackClick('player','light'); handleMobBossStart();handlePlayerStart();}}>Light Attack</button>
                    <button onClick={() => {handleAttackClick('player', 'normal'); handleMobBossStart();handlePlayerStart();}}>Normal Attack</button>
                    <button onClick={() => {handleAttackClick('player', 'heavy'); handleMobBossStart();handlePlayerStart();}}>Heavy Attack</button>
                </div>
            </div>
        );
    }else{
        return (
            <div>
                <h1>Vous avez perdu!</h1>
                <Link to="/">Retour à la création de personnage</Link>
            </div>
        );
    }
}

