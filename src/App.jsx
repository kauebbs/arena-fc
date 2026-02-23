import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';

const API_TOKEN = '876e29ef7a0048eeb9a1aa777c57f4e9';

const i18n = {
  pt: {
    paulistao: 'Paulistão',
    brasileirao: 'Brasileirão',
    worldCup: 'Copa do Mundo',
    champions: 'Champions',
    premierLeague: 'Premier League',
    laLiga: 'La Liga',
    bundesliga: 'Bundesliga',
    serieA: 'Serie A',
    relampago: 'Relâmpago',
    rapido: 'Rápido',
    medio: 'Médio',
    grande: 'Grande',
    settings: '⚙️ Ajustes',
    home: 'MANDANTE',
    away: 'VISITANTE',
    select: 'Selecionar...',
    selectLeague: 'Selecionar Liga',
    startMatch: 'INICIAR PARTIDA',
    goPenalties: 'IR PARA PÊNALTIS',
    fetching: 'Buscando base de dados...',
    errorDb: 'Erro de Conexão ou CORS.',
    matchOptions: 'Opções da Partida',
    matchDuration: 'Duração do Jogo',
    gameMode: 'Modo de Jogo',
    normal: 'Normal',
    penaltiesOnly: 'Só Pênaltis',
    goalSize: 'Tamanho do Gol',
    tight: 'Apertado',
    standard: 'Padrão',
    wide: 'Largo',
    extraTimeOpt: 'Prorrogação',
    yes: 'Sim',
    no: 'Não',
    penaltiesOpt: 'Pênaltis',
    save: 'Salvar',
    matchStarts: 'COMEÇA O JOGO!',
    penaltyShootout: 'DISPUTA DE PÊNALTIS!',
    willShoot: 'VAI BATER...',
    goal: 'GOL!',
    saved: 'DEFENDEU!',
    suddenDeath: 'MORTE SÚBITA!',
    round: 'RODADA',
    extraTimeAnnounce: 'PRORROGAÇÃO!',
    fullTime: 'FIM DE JOGO!',
    penaltyWin: 'VITÓRIA NOS PÊNALTIS',
    regularTime: 'TEMPO REGULAMENTAR',
    wins: 'VENCEU!',
    draw: 'EMPATE!',
    playAgain: 'Jogar Novamente'
  },
  en: {
    paulistao: 'Paulistão',
    brasileirao: 'Brasileirão',
    worldCup: 'World Cup',
    champions: 'Champions',
    premierLeague: 'Premier League',
    laLiga: 'La Liga',
    bundesliga: 'Bundesliga',
    serieA: 'Serie A',
    relampago: 'Lightning',
    rapido: 'Fast',
    medio: 'Medium',
    grande: 'Long',
    settings: '⚙️ Settings',
    home: 'HOME',
    away: 'AWAY',
    select: 'Select...',
    selectLeague: 'Select League',
    startMatch: 'START MATCH',
    goPenalties: 'GO TO PENALTIES',
    fetching: 'Fetching database...',
    errorDb: 'Connection or CORS Error.',
    matchOptions: 'Match Options',
    matchDuration: 'Match Duration',
    gameMode: 'Game Mode',
    normal: 'Normal',
    penaltiesOnly: 'Penalties Only',
    goalSize: 'Goal Size',
    tight: 'Tight',
    standard: 'Standard',
    wide: 'Wide',
    extraTimeOpt: 'Extra Time',
    yes: 'Yes',
    no: 'No',
    penaltiesOpt: 'Penalties',
    save: 'Save',
    matchStarts: 'MATCH STARTS!',
    penaltyShootout: 'PENALTY SHOOTOUT!',
    willShoot: 'WILL SHOOT...',
    goal: 'GOAL!',
    saved: 'SAVED!',
    suddenDeath: 'SUDDEN DEATH!',
    round: 'ROUND',
    extraTimeAnnounce: 'EXTRA TIME!',
    fullTime: 'FULL TIME!',
    penaltyWin: 'PENALTY SHOOTOUT WIN',
    regularTime: 'REGULAR TIME',
    wins: 'WINS!',
    draw: 'DRAW!',
    playAgain: 'Play Again'
  }
};

const LEAGUES = [
  { id: 'PAULISTAO', i18nKey: 'paulistao', code: null, img: 'https://upload.wikimedia.org/wikipedia/pt/thumb/1/1c/Paulist%C3%A3o_2026.png/330px-Paulist%C3%A3o_2026.png' },
  { id: 'BSA', i18nKey: 'brasileirao', code: 'BSA', img: 'https://upload.wikimedia.org/wikipedia/pt/thumb/7/75/Campeonato_Brasileiro_de_Futebol_de_2024_-_S%C3%A9rie_A.png/330px-Campeonato_Brasileiro_de_Futebol_de_2024_-_S%C3%A9rie_A.png' },
  { id: 'WC', i18nKey: 'worldCup', code: 'WC', img: 'https://upload.wikimedia.org/wikipedia/pt/d/d7/Logo_copa_2026.png' },
  { id: 'CL', i18nKey: 'champions', code: 'CL', img: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Logo_UEFA_Champions_League.png' },
  { id: 'PL', i18nKey: 'premierLeague', code: 'PL', img: 'https://b.fssta.com/uploads/application/soccer/competition-logos/EnglishPremierLeague.png' },
  { id: 'PD', i18nKey: 'laLiga', code: 'PD', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/LaLiga_logo_2023.svg/1200px-LaLiga_logo_2023.svg.png' },
  { id: 'BL1', i18nKey: 'bundesliga', code: 'BL1', img: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Bundesliga_logo_%282017%29.svg/1200px-Bundesliga_logo_%282017%29.svg.png' },
  { id: 'SA', i18nKey: 'serieA', code: 'SA', img: 'https://www.ogol.com.br/img/logos/edicoes/135636_imgbank_.png' },
];

const PAULISTAO_TEAMS = [
  { id: 'nov', name: 'Novorizontino', color: '#FFF200', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Gr%C3%AAmio_Novorizontino.svg/1280px-Gr%C3%AAmio_Novorizontino.svg.png' },
  { id: 'pal', name: 'Palmeiras', color: '#006437', img: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Palmeiras_logo.svg' },
  { id: 'rbb', name: 'Bragantino', color: '#ffffff', img: 'https://upload.wikimedia.org/wikipedia/pt/9/9e/RedBullBragantino.png' },
  { id: 'por', name: 'Portuguesa', color: '#D11520', img: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Portuguesa_de_Desportos.png' },
  { id: 'cor', name: 'Corinthians', color: '#ffffff', img: 'https://upload.wikimedia.org/wikipedia/pt/b/b4/Corinthians_simbolo.png' },
  { id: 'sao', name: 'São Paulo', color: '#C4122D', img: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Brasao_do_Sao_Paulo_Futebol_Clube.svg' },
  { id: 'cap', name: 'Capivariano', color: '#D11520', img: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Capivariano_FC.png' },
  { id: 'san', name: 'Santos', color: '#ffffff', img: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Santos_Logo.png' },
  { id: 'gua', name: 'Guarani', color: '#046A38', img: 'https://www.ogol.com.br/img/logos/equipas/2242_imgbank_1683641006.png' },
  { id: 'bot', name: 'Botafogo SP', color: '#D11520', img: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Botafogo_Futebol_Clube_%28Ribeir%C3%A3o_Preto%29_logo_%282021%29.png' },
  { id: 'mir', name: 'Mirassol', color: '#FFD700', img: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Mirassol_FC_logo.png' },
  { id: 'pri', name: 'Primavera', color: '#B22222', img: 'https://upload.wikimedia.org/wikipedia/pt/0/0c/Esporte_Clube_Primavera_logo.png' },
  { id: 'sbc', name: 'São Bernardo', color: '#FFD700', img: 'https://upload.wikimedia.org/wikipedia/commons/8/88/S%C3%A3o_Bernardo_FC_2020_crest.png' },
  { id: 'nor', name: 'Noroeste', color: '#D11520', img: 'https://upload.wikimedia.org/wikipedia/pt/3/36/EC_Noroeste.PNG' },
  { id: 'vel', name: 'Velo Clube', color: '#006437', img: 'https://upload.wikimedia.org/wikipedia/pt/6/60/Bra_sp_velo-clube.png' },
  { id: 'pon', name: 'Ponte Preta', color: '#ffffff', img: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Associa%C3%A7%C3%A3o_Atl%C3%A9tica_Ponte_Preta_logo.png' },
];

const DURATIONS = [
  { id: 'relampago', i18nKey: 'relampago', reg: 15, ext: 5 }, 
  { id: 'rapido', i18nKey: 'rapido', reg: 30, ext: 10 },
  { id: 'medio', i18nKey: 'medio', reg: 60, ext: 20 },
  { id: 'grande', i18nKey: 'grande', reg: 120, ext: 40 }
];

const GRAVITY = 0;           
const BOUNCE_IMPULSE = 1.0;  
const FRICTION = 1.0;        
const MIN_SPEED = 6;         
const MAX_SPEED = 10;        
const ROTATION_SPEED = 0.035;
const PENALTY_HOLE_DEG = 240; 
const TRAIL_LENGTH = 8; 

const randomRange = (min, max) => Math.random() * (max - min) + min;

const FutebolBolinhas = () => {
  const [lang, setLang] = useState('pt');
  const t = i18n[lang];
  const langRef = useRef('pt');

  const [isMobile, setIsMobile] = useState(false);
  const ballRadiusRef = useRef(28);

  const [activeLeagueId, setActiveLeagueId] = useState('PAULISTAO');
  const [showMobileLeagues, setShowMobileLeagues] = useState(false);
  const [displayedTeams, setDisplayedTeams] = useState(PAULISTAO_TEAMS);
  const teamsCache = useRef({ 'PAULISTAO': PAULISTAO_TEAMS });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [showSettings, setShowSettings] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState('medio'); 
  const [gameMode, setGameMode] = useState('normal'); 
  const [enableExtraTime, setEnableExtraTime] = useState(true);
  const [enablePenalties, setEnablePenalties] = useState(true);
  const [holeSize, setHoleSize] = useState(45); 
  
  const configRef = useRef({ holeSize: 45, gameMode: 'normal' });

  useEffect(() => { configRef.current = { holeSize, gameMode }; }, [holeSize, gameMode]);
  useEffect(() => { langRef.current = lang; }, [lang]);

  const [phase, setPhase] = useState('MENU'); 
  const [isExtraTime, setIsExtraTime] = useState(false);
  const [announcement, setAnnouncement] = useState(null);
  const [activeSelection, setActiveSelection] = useState(1); 
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);

  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [penScore1, setPenScore1] = useState(0);
  const [penScore2, setPenScore2] = useState(0);
  const [penHistory1, setPenHistory1] = useState([]);
  const [penHistory2, setPenHistory2] = useState([]);
  const [gameTime, setGameTime] = useState(0); 
  const [gameSize, setGameSize] = useState(600); 

  const [crowd, setCrowd] = useState([]);

  const audioHit = useRef(typeof Audio !== 'undefined' ? new Audio('/hit.mp3') : null);
  const audioGoal = useRef(typeof Audio !== 'undefined' ? new Audio('/goal.mp3') : null);
  const audioExtra = useRef(typeof Audio !== 'undefined' ? new Audio('/prorroga.mp3') : null); 
  const audioEnd = useRef(typeof Audio !== 'undefined' ? new Audio('/final.mp3') : null); 
  const audioCrowdBg = useRef(typeof Audio !== 'undefined' ? new Audio('/crowd_bg.mp3') : null);

  useEffect(() => {
    if (audioCrowdBg.current) {
        audioCrowdBg.current.loop = true;
        audioCrowdBg.current.volume = 0.2; 
    }

    const dots = [];
    const totalDots = 100;
    for (let i = 0; i < totalDots; i++) {
      dots.push({
        angle: (i / totalDots) * Math.PI * 2,
        dist: randomRange(1.15, 1.4),
        size: randomRange(4, 7),
        speed: randomRange(1.5, 3.5)
      });
    }
    setCrowd(dots);
  }, []);

  const gameState = useRef({ rotation: 0, isPlaying: false, balls: [] });
  const circleRef = useRef(null);
  const ballRefs = useRef({});
  const requestRef = useRef();
  const timerRef = useRef();
  
  const penRef = useRef({ active: false, turn: 1, round: 1, shotInProgress: false, s1: 0, s2: 0, shots1: 0, shots2: 0, h1: [], h2: [] });
  const scoreRef = useRef({ s1: 0, s2: 0 });

  const showAnnouncement = (text) => {
    setAnnouncement(text);
    setTimeout(() => setAnnouncement(null), 2000);
  };

  const triggerGoalEffects = (team) => {
    if (audioGoal.current) {
        audioGoal.current.currentTime = 0;
        audioGoal.current.volume = 0.8;
        audioGoal.current.play().catch(() => {});
    }
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: [team.color || '#ffffff', '#00ff66', '#ffffff'] });
  };

  const playHit = () => {
    if (audioHit.current) {
        audioHit.current.currentTime = 0;
        audioHit.current.volume = 0.4;
        audioHit.current.play().catch(() => {});
    }
  };

  const handleLeagueChange = async (league) => {
    setActiveLeagueId(league.id);
    setErrorMsg('');
    setShowMobileLeagues(false);
    if (teamsCache.current[league.id]) {
      setDisplayedTeams(teamsCache.current[league.id]);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`/api/v4/competitions/${league.code}/teams`, { headers: { 'X-Auth-Token': API_TOKEN } });
      if (response.data && response.data.teams) {
        const apiTeams = response.data.teams.map(team => ({
          id: team.id, name: team.shortName || team.name, img: team.crest, color: '#ffffff' 
        }));
        teamsCache.current[league.id] = apiTeams;
        setDisplayedTeams(apiTeams);
      }
    } catch (error) {
      setErrorMsg(i18n[langRef.current].errorDb);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      ballRadiusRef.current = mobile ? 16 : 28;

      const offsetHeight = phase === 'PENALTIES' ? (mobile ? 200 : 280) : (mobile ? 100 : 130);
      const availableHeight = window.innerHeight - offsetHeight; 
      const availableWidth = window.innerWidth - (mobile ? 20 : 40);

      if (mobile) {
        setGameSize(Math.max(220, Math.min(availableWidth - 80, availableHeight - 80)));
      } else {
        setGameSize(Math.max(300, Math.min(availableWidth, availableHeight))); 
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [phase]);

  const handleTeamSelect = (team) => {
    if (activeSelection === 1) {
      setTeam1(team);
      if (!team2) setActiveSelection(2); 
    } else {
      setTeam2(team);
      if (!team1) setActiveSelection(1);
    }
  };

  const startGame = () => {
    if (!team1 || !team2) return;
    setScore1(0); setScore2(0); setPenScore1(0); setPenScore2(0);
    setPenHistory1([]); setPenHistory2([]);
    scoreRef.current = { s1: 0, s2: 0 }; 
    setGameTime(0); setIsExtraTime(false);
    penRef.current = { active: false, turn: 1, round: 1, shotInProgress: false, s1: 0, s2: 0, shots1: 0, shots2: 0, h1: [], h2: [] };
    
    gameState.current.isPlaying = true;
    gameState.current.rotation = 0;

    if (gameMode === 'penalties') {
      startPenalties();
      return;
    }

    gameState.current.balls = [
      { id: 1, x: randomRange(-80, -40), y: randomRange(-50, 50), vx: randomRange(4, 8), vy: randomRange(-5, 5) || 3, team: team1, scored: false, trail: [] },
      { id: 2, x: randomRange(40, 80), y: randomRange(-50, 50), vx: randomRange(-8, -4), vy: randomRange(-5, 5) || -3, team: team2, scored: false, trail: [] }
    ];
    
    setPhase('PLAYING');
    showAnnouncement(i18n[langRef.current].matchStarts);
    if (audioCrowdBg.current) {
        audioCrowdBg.current.currentTime = 0;
        audioCrowdBg.current.play().catch(() => {});
    }
  };

  const startPenalties = () => {
    clearInterval(timerRef.current);
    setPhase('PENALTIES');
    showAnnouncement(i18n[langRef.current].penaltyShootout);
    penRef.current = { active: true, turn: 1, round: 1, shotInProgress: false, s1: 0, s2: 0, shots1: 0, shots2: 0, h1: [], h2: [] };
    gameState.current.balls = []; 
    setTimeout(() => preparePenaltyShot(), 3000);
  };

  const preparePenaltyShot = () => {
    const p = penRef.current;
    p.shotInProgress = false;
    const activeTeam = p.turn === 1 ? team1 : team2;
    showAnnouncement(`${activeTeam.name} ${i18n[langRef.current].willShoot}`);
    gameState.current.balls = [
      { id: p.turn, x: 0, y: 0, vx: 0, vy: 0, team: activeTeam, scored: false, trail: [] }
    ];
    setTimeout(() => {
      if (gameState.current.balls[0]) {
        const angle = randomRange(0, Math.PI * 2);
        const speed = 20; 
        gameState.current.balls[0].vx = Math.cos(angle) * speed;
        gameState.current.balls[0].vy = Math.sin(angle) * speed;
        p.shotInProgress = true;
      }
    }, 2000);
  };

  gameState.current.onNormalGoal = (teamId) => {
    if (teamId === 1) { scoreRef.current.s1++; setScore1(scoreRef.current.s1); } 
    else { scoreRef.current.s2++; setScore2(scoreRef.current.s2); }
    triggerGoalEffects(teamId === 1 ? team1 : team2);
    showAnnouncement(i18n[langRef.current].goal);
  };

  gameState.current.onPenaltyResult = (result) => {
    const p = penRef.current;
    p.shotInProgress = false;
    if (p.turn === 1) {
      p.shots1++; p.h1.push(result); setPenHistory1([...p.h1]);
    } else {
      p.shots2++; p.h2.push(result); setPenHistory2([...p.h2]);
    }
    if (result === 'goal') {
      if (p.turn === 1) { p.s1++; setPenScore1(p.s1); } else { p.s2++; setPenScore2(p.s2); }
      triggerGoalEffects(p.turn === 1 ? team1 : team2);
      showAnnouncement(i18n[langRef.current].goal);
    } else {
      playHit(); showAnnouncement(i18n[langRef.current].saved);
    }
    setTimeout(() => {
      gameState.current.balls = []; 
      let matchOver = false;
      if (p.shots1 <= 5 && p.shots2 <= 5) {
        const remaining1 = 5 - p.shots1; const remaining2 = 5 - p.shots2;
        if (p.s1 > p.s2 + remaining2) matchOver = true; 
        if (p.s2 > p.s1 + remaining1) matchOver = true; 
        if (p.shots1 === 5 && p.shots2 === 5 && p.s1 !== p.s2) matchOver = true; 
      } else {
        if (p.shots1 === p.shots2 && p.s1 !== p.s2) matchOver = true;
      }
      if (matchOver) { endGame(); } 
      else {
        if (p.turn === 1) {
          p.turn = 2; preparePenaltyShot();
        } else {
          p.round++; p.turn = 1;
          const isSuddenDeath = p.round > 5;
          showAnnouncement(isSuddenDeath ? i18n[langRef.current].suddenDeath : `${i18n[langRef.current].round} ${p.round}`);
          setTimeout(() => preparePenaltyShot(), 2500);
        }
      }
    }, 2500);
  };

  useEffect(() => {
    if (phase !== 'PLAYING') return;
    timerRef.current = setInterval(() => {
      setGameTime(prev => {
        const nextTime = prev + 1;
        const config = DURATIONS.find(d => d.id === selectedDuration);
        const totalDuration = isExtraTime ? (config.reg + config.ext) : config.reg;
        if (prev === config.reg && !isExtraTime) {
          if (scoreRef.current.s1 === scoreRef.current.s2) { 
            if (enableExtraTime) {
              setIsExtraTime(true);
              showAnnouncement(i18n[langRef.current].extraTimeAnnounce);
              if (audioExtra.current) {
                  audioExtra.current.currentTime = 0; audioExtra.current.play().catch(()=>{});
              }
              return nextTime; 
            } else if (enablePenalties) {
              startPenalties(); return prev;
            } else { endGame(); return prev; }
          } else { endGame(); return prev; }
        }
        if (nextTime >= totalDuration && isExtraTime) { 
          if (scoreRef.current.s1 === scoreRef.current.s2) { 
            if (enablePenalties) { startPenalties(); return prev; }
            else { endGame(); return totalDuration; }
          } else { endGame(); return totalDuration; }
        }
        return nextTime;
      });
    }, 1000); 
    return () => clearInterval(timerRef.current);
  }, [phase, isExtraTime, selectedDuration, enableExtraTime, enablePenalties]);

  const endGame = () => {
    clearInterval(timerRef.current);
    gameState.current.isPlaying = false;
    setPhase('GAMEOVER');
    if (audioEnd.current) {
        audioEnd.current.currentTime = 0; 
        audioEnd.current.volume = 0.7; 
        audioEnd.current.play().catch(()=>{});
    }
    if (audioCrowdBg.current) audioCrowdBg.current.pause(); 
    showAnnouncement(i18n[langRef.current].fullTime);
  };

  const getDisplayTime = () => {
    if (phase === 'PENALTIES') return '';
    const config = DURATIONS.find(d => d.id === selectedDuration);
    if (!isExtraTime) return Math.min(90, Math.floor((gameTime / config.reg) * 90));
    return Math.min(120, 90 + Math.floor(((gameTime - config.reg) / config.ext) * 30));
  };

  const updatePhysics = () => {
    if (!gameState.current.isPlaying) return;
    const state = gameState.current;
    const pState = penRef.current;
    const { holeSize } = configRef.current; 
    
    const currentBallRadius = ballRadiusRef.current;
    
    const wallWidth = 15; 
    const wallRadius = (gameSize / 2) - wallWidth; 
    const innerLimit = wallRadius - currentBallRadius; 
    const outerLimit = wallRadius + currentBallRadius; 
    const currentHoleSizeDeg = pState.active ? PENALTY_HOLE_DEG : holeSize;
    const curRotSpeed = pState.active ? ROTATION_SPEED * 0.4 : ROTATION_SPEED;
    
    state.rotation += curRotSpeed;
    if (state.rotation > Math.PI * 2) state.rotation -= Math.PI * 2;
    if (circleRef.current) circleRef.current.style.transform = `rotate(${state.rotation}rad)`;

    state.balls.forEach(ball => {
      ball.trail.push({ x: ball.x, y: ball.y });
      if (ball.trail.length > TRAIL_LENGTH) ball.trail.shift();
      if (!pState.active) {
        ball.vy += GRAVITY; ball.vx *= FRICTION; ball.vy *= FRICTION; 
        const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
        if (speed > 0) { 
          if (speed < MIN_SPEED) { ball.vx = (ball.vx / speed) * MIN_SPEED; ball.vy = (ball.vy / speed) * MIN_SPEED; } 
          else if (speed > MAX_SPEED) { ball.vx = (ball.vx / speed) * MAX_SPEED; ball.vy = (ball.vy / speed) * MAX_SPEED; }
        }
      }
      ball.x += ball.vx; ball.y += ball.vy;
    });

    if (!pState.active) {
      const b1 = state.balls[0]; const b2 = state.balls[1];
      if (b1 && b2 && !b1.scored && !b2.scored) {
        const dx = b2.x - b1.x; const dy = b2.y - b1.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < currentBallRadius * 2) {
          const nx = dx/dist; const ny = dy/dist;
          const overlap = (currentBallRadius * 2) - dist;
          b1.x -= nx*overlap*0.5; b1.y -= ny*overlap*0.5; b2.x += nx*overlap*0.5; b2.y += ny*overlap*0.5;
          const p = 2*(b1.vx*nx + b1.vy*ny - b2.vx*nx - b2.vy*ny)/2;
          b1.vx -= p*nx; b1.vy -= p*ny; b2.vx += p*nx; b2.vy += p*ny;
          playHit();
        }
      }
    }

    const holeHalfRad = (currentHoleSizeDeg * Math.PI / 180) / 2;
    state.balls.forEach(ball => {
      const ballEl = ballRefs.current[ball.id];
      if (!ballEl) return;
      const dist = Math.sqrt(ball.x*ball.x + ball.y*ball.y);
      if (!ball.scored) {
        if (dist > innerLimit && dist < outerLimit) {
          const angle = Math.atan2(ball.y, ball.x);
          let bAng = angle < 0 ? angle + Math.PI*2 : angle;
          let diff = Math.abs(bAng - state.rotation);
          if (diff > Math.PI) diff = (Math.PI*2) - diff;
          const ballHalfAngle = Math.atan2(currentBallRadius, dist);
          if (diff > holeHalfRad - ballHalfAngle) {
            if (dist <= wallRadius) {
              const nx = ball.x/dist; const ny = ball.y/dist;
              ball.x = nx*innerLimit; ball.y = ny*innerLimit;
              const dot = ball.vx*nx + ball.vy*ny;
              if (dot > 0) { ball.vx = (ball.vx - 2*dot*nx) * BOUNCE_IMPULSE; ball.vy = (ball.vy - 2*dot*ny) * BOUNCE_IMPULSE; playHit(); }
              if (pState.active && pState.shotInProgress) { pState.shotInProgress = false; state.onPenaltyResult('miss'); }
            } else {
              const nx = ball.x/dist; const ny = ball.y/dist;
              ball.x = nx*outerLimit; ball.y = ny*outerLimit;
              const dot = ball.vx*nx + ball.vy*ny;
              if (dot < 0) { ball.vx = (ball.vx - 2*dot*nx) * BOUNCE_IMPULSE; ball.vy = (ball.vy - 2*dot*ny) * BOUNCE_IMPULSE; playHit(); }
            }
          }
        } else if (dist >= outerLimit) {
          ball.scored = true;
          if (pState.active && pState.shotInProgress) {
            pState.shotInProgress = false; state.onPenaltyResult('goal');
          } else if (!pState.active) {
            state.onNormalGoal(ball.id);
            state.balls.forEach(b => {
              b.x = randomRange(-40, 40); b.y = randomRange(-40, 40);
              b.vx = randomRange(6, 8) * (Math.random() > 0.5 ? 1 : -1); 
              b.vy = randomRange(6, 8) * (Math.random() > 0.5 ? 1 : -1);
              b.scored = false; b.trail = []; 
            });
          }
        }
      }
      ballEl.style.transform = `translate(${ball.x}px, ${ball.y}px)`;
      ball.trail.forEach((pos, i) => {
        const trailEl = document.getElementById(`trail-${ball.id}-${i}`);
        if (trailEl) { trailEl.style.transform = `translate(${pos.x}px, ${pos.y}px) scale(${0.4 + (i/TRAIL_LENGTH)*0.6})`; }
      });
    });
    requestRef.current = requestAnimationFrame(updatePhysics);
  };

  useEffect(() => {
    if (phase === 'PLAYING' || phase === 'PENALTIES') requestRef.current = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(requestRef.current);
  }, [phase, gameSize]);

  const renderPenaltyGrid = () => {
    const totalBoxes = Math.max(5, Math.max(penHistory1.length, penHistory2.length));
    const getBoxIcon = (status) => {
      if (status === 'goal') return '⚽';
      if (status === 'miss') return <span style={{color: '#ff3366'}}>✖</span>;
      return '';
    };
    return (
      <div style={{...styles.penaltyBoard, gap: isMobile ? '4px' : '6px'}}>
        <div style={styles.penRow}>
          <img src={team1?.img} style={{...styles.penLogo, width: isMobile ? '20px' : '30px', height: isMobile ? '20px' : '30px', marginRight: isMobile ? '8px' : '15px'}} alt=""/>
          {Array.from({length: totalBoxes}).map((_, i) => (
            <div key={`t1-${i}`} style={{...styles.penBox, width: isMobile ? '22px' : '30px', height: isMobile ? '22px' : '30px', fontSize: isMobile ? '10px' : '14px'}}>{getBoxIcon(penHistory1[i])}</div>
          ))}
          <div style={{...styles.penTotal, width: isMobile ? '26px' : '35px', height: isMobile ? '26px' : '35px', fontSize: isMobile ? '12px' : '16px', marginLeft: isMobile ? '8px' : '15px'}}>{penScore1}</div>
        </div>
        <div style={styles.penRow}>
          <img src={team2?.img} style={{...styles.penLogo, width: isMobile ? '20px' : '30px', height: isMobile ? '20px' : '30px', marginRight: isMobile ? '8px' : '15px'}} alt=""/>
          {Array.from({length: totalBoxes}).map((_, i) => (
            <div key={`t2-${i}`} style={{...styles.penBox, width: isMobile ? '22px' : '30px', height: isMobile ? '22px' : '30px', fontSize: isMobile ? '10px' : '14px'}}>{getBoxIcon(penHistory2[i])}</div>
          ))}
          <div style={{...styles.penTotal, width: isMobile ? '26px' : '35px', height: isMobile ? '26px' : '35px', fontSize: isMobile ? '12px' : '16px', marginLeft: isMobile ? '8px' : '15px'}}>{penScore2}</div>
        </div>
      </div>
    );
  };

  const currentHoleSizeDeg = phase === 'PENALTIES' ? PENALTY_HOLE_DEG : holeSize;
  const radius = (gameSize / 2) - 15;
  const holeArc = (2 * Math.PI * radius) * (currentHoleSizeDeg / 360);
  const dashArray = `${(2 * Math.PI * radius) - holeArc} ${holeArc}`;
  const svgOffsetRotation = currentHoleSizeDeg / 2; 

  const toggleLang = () => {
    setLang(prev => prev === 'pt' ? 'en' : 'pt');
  };

  const activeLeagueObj = LEAGUES.find(l => l.id === activeLeagueId);

  return (
    <div style={styles.container}>
      
      <style>{`
        @keyframes popIn { 0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; } 60% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; } 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; } }
        @keyframes crowdPulse { 0% { opacity: 0.6; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.02); } 100% { opacity: 0.6; transform: scale(1); } }
        @keyframes crowdJump {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
          50% { transform: translate(-50%, -50%) scale(1.4) translateY(-3px); opacity: 0.8; }
        }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .announcement-text { animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        ::-webkit-scrollbar { width: 6px; height: 6px; background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0, 255, 102, 0.3); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0, 255, 102, 0.6); }
      `}</style>

      {phase === 'MENU' && (
        <div style={styles.menuOverlay}>
          <button onClick={toggleLang} style={{...styles.langBtn, padding: isMobile ? '12px 20px' : '8px 16px', minHeight: isMobile ? '44px' : 'auto'}}>
            {lang === 'pt' ? '🇺🇸 EN' : '🇧🇷 PT'}
          </button>
          <button onClick={() => setShowSettings(true)} style={{...styles.settingsBtn, padding: isMobile ? '12px 20px' : '8px 16px', minHeight: isMobile ? '44px' : 'auto'}}>
            {t.settings}
          </button>
          <div style={{...styles.header, padding: isMobile ? '70px 15px 10px' : '40px 20px 20px'}}>
            <h1 style={{...styles.menuTitle, fontSize: isMobile ? '24px' : '28px', marginBottom: isMobile ? '25px' : '40px'}}>ARENA FC</h1>
            <div style={{...styles.dashboardRow, gap: isMobile ? '15px' : '30px'}}>
              <div onClick={() => setActiveSelection(1)} style={{...styles.dashCard, height: isMobile ? '120px' : '140px', borderColor: activeSelection === 1 ? '#00ff66' : 'rgba(255,255,255,0.1)'}}>
                <span style={{...styles.dashLabel, fontSize: isMobile ? '9px' : '10px'}}>{t.home}</span>
                {team1 ? (
                  <>
                    <img src={team1.img} style={{...styles.dashLogo, width: isMobile ? '45px' : '55px', height: isMobile ? '45px' : '55px'}} alt=""/>
                    <span style={{...styles.dashTeamName, fontSize: isMobile ? '12px' : '14px', textAlign: 'center', padding: '0 5px'}}>{team1.name}</span>
                  </>
                ) : <span style={styles.dashEmpty}>{t.select}</span>}
              </div>
              <span style={{...styles.dashVs, fontSize: isMobile ? '16px' : '18px'}}>X</span>
              <div onClick={() => setActiveSelection(2)} style={{...styles.dashCard, height: isMobile ? '120px' : '140px', borderColor: activeSelection === 2 ? '#00ff66' : 'rgba(255,255,255,0.1)'}}>
                <span style={{...styles.dashLabel, fontSize: isMobile ? '9px' : '10px'}}>{t.away}</span>
                {team2 ? (
                  <>
                    <img src={team2.img} style={{...styles.dashLogo, width: isMobile ? '45px' : '55px', height: isMobile ? '45px' : '55px'}} alt="" />
                    <span style={{...styles.dashTeamName, fontSize: isMobile ? '12px' : '14px', textAlign: 'center', padding: '0 5px'}}>{team2.name}</span>
                  </>
                ) : <span style={styles.dashEmpty}>{t.select}</span>}
              </div>
            </div>
            <div style={{height: '50px', marginTop: '25px', width: '100%', display: 'flex', justifyContent: 'center'}}>
              {team1 && team2 && (
                <button onClick={startGame} style={{...styles.playBtn, padding: isMobile ? '0 40px' : '16px 45px', minHeight: isMobile ? '48px' : 'auto', fontSize: isMobile ? '14px' : '13px'}}>
                  {gameMode === 'normal' ? t.startMatch : t.goPenalties}
                </button>
              )}
            </div>
          </div>
          
          {isMobile ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
              <button onClick={() => setShowMobileLeagues(true)} style={styles.mobileLeagueTrigger}>
                <img src={activeLeagueObj?.img} style={styles.leagueIcon} alt="" />
                {t[activeLeagueObj?.i18nKey] || t.selectLeague}
                <span style={{ marginLeft: '10px', fontSize: '10px' }}>▼</span>
              </button>
            </div>
          ) : (
            <div style={{...styles.leaguesContainer, padding: '10px 20px'}}>
              {LEAGUES.map(league => (
                <button key={league.id} onClick={() => handleLeagueChange(league)}
                  style={{
                    ...styles.leagueBtn,
                    background: activeLeagueId === league.id ? 'rgba(0, 255, 102, 0.15)' : 'rgba(255,255,255,0.03)',
                    borderColor: activeLeagueId === league.id ? '#00ff66' : 'rgba(255,255,255,0.1)',
                    color: activeLeagueId === league.id ? '#00ff66' : '#aaa'
                  }}>
                  <img src={league.img} style={styles.leagueIcon} alt={league.name}/>
                  {t[league.i18nKey]}
                </button>
              ))}
            </div>
          )}

          <div style={styles.gridWrapper}>
            {loading ? (
               <div style={{color:'#00ff66', marginTop:'50px', fontWeight:'300', textAlign: 'center'}}>{t.fetching}</div>
            ) : errorMsg ? (
               <div style={{color:'#ff3366', marginTop:'50px', textAlign: 'center'}}>{errorMsg}</div>
            ) : (
              <div style={{...styles.grid, gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(80px, 1fr))' : 'repeat(auto-fill, minmax(90px, 1fr))'}}>
                {displayedTeams.map(team => (
                  <button key={team.id} onClick={() => handleTeamSelect(team)}
                    style={{
                      ...styles.card,
                      border: ((activeSelection===1 && team1?.id === team.id) || (activeSelection===2 && team2?.id === team.id)) ? '1px solid #00ff66' : '1px solid rgba(255,255,255,0.05)',
                      opacity: (team1?.id === team.id || team2?.id === team.id) ? 0.3 : 1,
                      padding: isMobile ? '20px 5px' : '15px 10px'
                    }}>
                    <img src={team.img} alt={team.name} style={{...styles.cardImg, width: isMobile ? '35px' : '40px', height: isMobile ? '35px' : '40px'}} />
                    <span style={{...styles.cardText, fontSize: isMobile ? '10px' : '11px'}}>{team.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showMobileLeagues && isMobile && (
        <div style={styles.mobileLeagueModalOverlay} onClick={() => setShowMobileLeagues(false)}>
          <div style={styles.mobileLeagueCard} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#fff', marginBottom: '20px', fontWeight: '400', textAlign: 'center', fontSize: '16px' }}>{t.selectLeague}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '50vh', overflowY: 'auto', paddingBottom: '20px' }}>
              {LEAGUES.map(league => (
                <button key={league.id} onClick={() => handleLeagueChange(league)}
                  style={{
                    ...styles.leagueBtn,
                    background: activeLeagueId === league.id ? 'rgba(0, 255, 102, 0.15)' : 'rgba(255,255,255,0.03)',
                    borderColor: activeLeagueId === league.id ? '#00ff66' : 'rgba(255,255,255,0.1)',
                    color: activeLeagueId === league.id ? '#00ff66' : '#aaa',
                    padding: '12px 20px',
                    minHeight: '48px',
                    width: '100%',
                    justifyContent: 'flex-start'
                  }}>
                  <img src={league.img} style={styles.leagueIcon} alt={league.name}/>
                  {t[league.i18nKey]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div style={styles.settingsModal}>
          <div style={{...styles.settingsContent, width: isMobile ? '92%' : '400px', padding: isMobile ? '25px 20px' : '40px'}}>
            <h2 style={{fontWeight: '300', marginBottom: '30px', color: '#fff'}}>{t.matchOptions}</h2>
            
            <div style={styles.configRow}>
              <span style={styles.configLabel}>{t.matchDuration}</span>
              <div style={styles.pillGroup}>
                {DURATIONS.map(d => (
                  <button key={d.id} onClick={() => setSelectedDuration(d.id)} style={selectedDuration === d.id ? styles.pillActive : styles.pillInactive}>{t[d.i18nKey]}</button>
                ))}
              </div>
            </div>

            <div style={styles.configRow}>
              <span style={styles.configLabel}>{t.gameMode}</span>
              <div style={styles.pillGroup}>
                <button onClick={() => setGameMode('normal')} style={gameMode === 'normal' ? styles.pillActive : styles.pillInactive}>{t.normal}</button>
                <button onClick={() => setGameMode('penalties')} style={gameMode === 'penalties' ? styles.pillActive : styles.pillInactive}>{t.penaltiesOnly}</button>
              </div>
            </div>

            <div style={styles.configRow}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={styles.configLabel}>{t.goalSize}</span>
                <span style={{ color: '#00ff66', fontSize: '12px', fontWeight: '600' }}>{holeSize}°</span>
              </div>
              <input 
                type="range" 
                min="15" 
                max="90" 
                step="1"
                value={holeSize} 
                onChange={(e) => setHoleSize(Number(e.target.value))}
                style={styles.slider}
              />
            </div>

            <div style={{display:'flex', gap:'20px', width:'100%', flexDirection: isMobile ? 'column' : 'row'}}>
              <div style={styles.configRow}>
                <span style={styles.configLabel}>{t.extraTimeOpt}</span>
                <div style={styles.pillGroup}>
                  <button onClick={() => setEnableExtraTime(true)} style={enableExtraTime ? styles.pillActive : styles.pillInactive}>{t.yes}</button>
                  <button onClick={() => setEnableExtraTime(false)} style={!enableExtraTime ? styles.pillActive : styles.pillInactive}>{t.no}</button>
                </div>
              </div>
              <div style={styles.configRow}>
                <span style={styles.configLabel}>{t.penaltiesOpt}</span>
                <div style={styles.pillGroup}>
                  <button onClick={() => setEnablePenalties(true)} style={enablePenalties ? styles.pillActive : styles.pillInactive}>{t.yes}</button>
                  <button onClick={() => setEnablePenalties(false)} style={!enablePenalties ? styles.pillActive : styles.pillInactive}>{t.no}</button>
                </div>
              </div>
            </div>
            
            <button onClick={() => setShowSettings(false)} style={styles.closeModalBtn}>{t.save}</button>
          </div>
        </div>
      )}

      {phase === 'GAMEOVER' && (
        <div style={styles.overlay}>
          <h1 style={{fontSize: isMobile ? '22px' : '28px', letterSpacing:'8px', fontWeight: '300', textAlign: 'center'}}>{t.fullTime}</h1>
          <h3 style={{color: '#00ff66', marginBottom:'30px', fontWeight:'400', fontSize:'14px', textAlign: 'center'}}>
            {penScore1 > 0 || penScore2 > 0 ? `${t.penaltyWin} (${penScore1} - ${penScore2})` : isExtraTime ? t.extraTimeOpt.toUpperCase() : t.regularTime}
          </h3>
          <div style={styles.finalScoreRow}>
            <div style={styles.finalTeamBox}>
               <img src={team1?.img} style={{width: isMobile ? '50px' : '80px', height: isMobile ? '50px' : '80px', objectFit:'contain'}} alt="" />
               <span style={{textAlign: 'center'}}>{team1?.name}</span>
            </div>
            <div style={{...styles.bigScore, fontSize: isMobile ? '40px' : '60px'}}>
              <span>{score1}</span><span style={{fontSize: isMobile ? '20px' : '30px', color:'#333', fontWeight:'300'}}>x</span><span>{score2}</span>
            </div>
            <div style={styles.finalTeamBox}>
               <img src={team2?.img} style={{width: isMobile ? '50px' : '80px', height: isMobile ? '50px' : '80px', objectFit:'contain'}} alt="" />
               <span style={{textAlign: 'center'}}>{team2?.name}</span>
            </div>
          </div>
          <h2 style={{fontSize: isMobile ? '20px' : '24px', margin: '30px 0', fontWeight: '400', textAlign: 'center'}}>
             {score1 > score2 || penScore1 > penScore2 ? `${team1.name} ${t.wins}` : score2 > score1 || penScore2 > penScore1 ? `${team2.name} ${t.wins}` : t.draw}
          </h2>
          <button onClick={() => { setPhase('MENU'); setTeam1(null); setTeam2(null); setActiveSelection(1); }} style={{...styles.btnSlim, minHeight: isMobile ? '48px' : 'auto'}}>{t.playAgain}</button>
        </div>
      )}

      {announcement && <div className="announcement-text" style={styles.announcementBox}>{announcement}</div>}

      <div style={{...styles.gameContainer, opacity: phase === 'MENU' ? 0 : 1, display: phase === 'MENU' ? 'none' : 'flex'}}>
        {phase !== 'PENALTIES' && (
          <div style={{...styles.scoreboard, gap: isMobile ? '20px' : '40px'}}>
            <div style={styles.scoreTeamBox}>
              <img src={team1?.img || ''} style={{...styles.scoreLogo, width: isMobile ? '30px' : '40px', height: isMobile ? '30px' : '40px'}} alt="" />
              <span style={{...styles.scoreNum, fontSize: isMobile ? '28px' : '38px'}}>{score1}</span>
            </div>
            <div style={styles.timerBox}>
              <span style={{fontSize: isMobile ? '24px' : '32px', fontWeight: '300', fontFamily:'monospace'}}>{getDisplayTime()}'</span>
              <span style={{fontSize: '9px', color: isExtraTime ? '#00ff66' : '#666', letterSpacing:'3px'}}>{isExtraTime ? 'EXTRA' : 'LIVE'}</span>
            </div>
            <div style={styles.scoreTeamBox}>
              <span style={{...styles.scoreNum, fontSize: isMobile ? '28px' : '38px'}}>{score2}</span>
              <img src={team2?.img || ''} style={{...styles.scoreLogo, width: isMobile ? '30px' : '40px', height: isMobile ? '30px' : '40px'}} alt="" />
            </div>
          </div>
        )}
        
        <div style={{...styles.gameArea, width: gameSize, height: gameSize}}>
          
          {crowd.map((dot, i) => {
            const teamColor = i % 2 === 0 ? (team1?.color || '#fff') : (team2?.color || '#fff');
            const baseRadius = (gameSize / 2);
            const x = Math.cos(dot.angle) * (baseRadius * dot.dist);
            const y = Math.sin(dot.angle) * (baseRadius * dot.dist);
            return (
              <div key={`fan-${i}`}
                style={{
                  position: 'absolute', left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`,
                  width: dot.size, height: dot.size, backgroundColor: teamColor, borderRadius: '50%',
                  boxShadow: `0 0 10px ${teamColor}`, opacity: 0.6, zIndex: 0,
                  animation: `crowdJump ${dot.speed}s ease-in-out infinite`, transform: 'translate(-50%, -50%)'
                }}
              />
            );
          })}

          <div style={{...styles.pitchBackground, width: radius * 2, height: radius * 2}}>
            <div style={styles.pitchGrid} />
            <div style={styles.pitchMidline} />
            <div style={styles.pitchCenterCircle} />
            <div style={styles.pitchPenaltyBoxLeft} />
            <div style={styles.pitchPenaltyBoxRight} />
          </div>

          <div ref={circleRef} style={styles.rotatingLayer}>
            <svg width={gameSize} height={gameSize} viewBox={`0 0 ${gameSize} ${gameSize}`}>
              <circle cx={gameSize/2} cy={gameSize/2} r={radius} fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="12" 
                strokeDasharray={dashArray} strokeLinecap="butt" 
                style={{filter: phase === 'PENALTIES' ? 'drop-shadow(0 0 10px #00ff66)' : 'drop-shadow(0 0 8px rgba(255,255,255,0.5))', transition: 'stroke 0.5s, filter 0.5s'}}
                transform={`rotate(${svgOffsetRotation}, ${gameSize/2}, ${gameSize/2})`} />
            </svg>
          </div>
          
          {gameState.current.balls.map(ball => (
            <React.Fragment key={ball.id}>
              {[...Array(TRAIL_LENGTH)].map((_, i) => {
                 const trailOpacity = (i + 1) / TRAIL_LENGTH * 0.5;
                 return (
                   <div key={i} id={`trail-${ball.id}-${i}`} 
                     style={{
                       ...styles.ball, 
                       width: ballRadiusRef.current * 2, 
                       height: ballRadiusRef.current * 2, 
                       zIndex: 5, 
                       backgroundImage: `url(${ball.team.img})`, backgroundSize: 'contain',
                       backgroundPosition: 'center', opacity: trailOpacity, filter: 'grayscale(30%) brightness(0.7)', willChange: 'transform, opacity'
                     }} 
                   />
                 );
              })}
              <div ref={el => ballRefs.current[ball.id] = el}
                style={{
                  ...styles.ball, 
                  width: ballRadiusRef.current * 2, 
                  height: ballRadiusRef.current * 2, 
                  display: phase === 'MENU' ? 'none' : 'block',
                  backgroundImage: `url(${ball.team.img})`, backgroundSize: 'contain', 
                  backgroundPosition: 'center', backgroundRepeat: 'no-repeat', zIndex: 10
                }}
              />
            </React.Fragment>
          ))}
        </div>
        {phase === 'PENALTIES' && renderPenaltyGrid()}
      </div>
    </div>
  );
};

const styles = {
  container: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#09090e', color: '#e2e8f0', fontFamily: '"Inter", "Segoe UI", Roboto, Helvetica, sans-serif', overflow: 'hidden', userSelect: 'none' },
  announcementBox: { position: 'absolute', top: '50%', left: '50%', zIndex: 1000, fontSize: '5vw', fontWeight: '800', color: '#fff', textShadow: '0 0 20px #000, 0 0 40px #00ff66', textAlign: 'center', pointerEvents: 'none', whiteSpace: 'nowrap', fontStyle: 'italic' },
  menuOverlay: { position: 'absolute', zIndex: 50, width: '100%', height: '100%', background: 'radial-gradient(circle at top, #111827 0%, #0f172a 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  header: { width: '100%', padding: '40px 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  menuTitle: { fontSize: '28px', letterSpacing: '6px', fontWeight: '300', color: '#fff', marginBottom: '40px' },
  dashboardRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px', width: '100%', maxWidth: '700px' },
  dashCard: { flex: 1, height: '140px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.3s', position: 'relative' },
  dashLabel: { position: 'absolute', top: '-10px', background: '#0f172a', padding: '4px 12px', borderRadius: '20px', fontSize: '10px', color: '#94a3b8', fontWeight: '600', letterSpacing: '1px' },
  dashLogo: { width: '55px', height: '55px', objectFit: 'contain', marginBottom: '10px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' },
  dashTeamName: { fontSize: '14px', fontWeight: '400', color: '#f8fafc' },
  dashEmpty: { color: '#475569', fontStyle: 'italic', fontSize: '13px' },
  dashVs: { fontSize: '18px', fontWeight: '300', color: '#334155' },
  playBtn: { padding: '16px 45px', fontSize: '13px', fontWeight: '600', letterSpacing: '2px', cursor: 'pointer', background: 'transparent', color: '#00ff66', border: '1px solid #00ff66', borderRadius: '50px', boxShadow: '0 0 15px rgba(0, 255, 102, 0.1)', transition: '0.2s', textTransform: 'uppercase' },
  langBtn: { position: 'absolute', top: '25px', left: '30px', fontSize: '12px', letterSpacing: '1px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '8px 16px', cursor: 'pointer', zIndex: 60, transition: '0.2s' },
  settingsBtn: { position: 'absolute', top: '25px', right: '30px', fontSize: '12px', letterSpacing: '1px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '8px 16px', cursor: 'pointer', zIndex: 60, transition: '0.2s' },
  settingsModal: { position: 'absolute', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  settingsContent: { background: '#0f172a', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', width: '400px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' },
  configRow: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', width: '100%' },
  configLabel: { fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' },
  pillGroup: { display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '4px' },
  pillActive: { flex: 1, padding: '10px', background: '#334155', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', transition:'0.2s', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' },
  pillInactive: { flex: 1, padding: '10px', background: 'transparent', color: '#64748b', border: 'none', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', transition:'0.2s' },
  closeModalBtn: { marginTop: '10px', padding: '15px', background: '#00ff66', color: '#000', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', letterSpacing:'1px' },
  leaguesContainer: { display: 'flex', gap: '10px', padding: '10px 20px', overflowX: 'auto', width: '100%', justifyContent: 'center', marginBottom: '20px' },
  leagueBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '20px', border: '1px solid', cursor: 'pointer', fontSize: '12px', fontWeight: '400', whiteSpace: 'nowrap', transition: '0.2s' },
  leagueIcon: { width: '18px', height: '18px', objectFit: 'contain' },
  gridWrapper: { flex: 1, overflowY: 'auto', width: '100%', paddingBottom:'40px', minHeight: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '10px', width: '90%', maxWidth: '1000px', padding: '10px', margin: '0 auto' },
  card: { background: 'transparent', borderRadius: '16px', padding: '15px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', transition: '0.2s', cursor: 'pointer' },
  cardImg: { width: '40px', height: '40px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' },
  cardText: { color: '#cbd5e1', fontWeight: '300', fontSize: '11px', textAlign: 'center', lineHeight:'1.2' },
  gameContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', transition: 'opacity 0.5s', gap: '30px' },
  scoreboard: { zIndex: 20, display: 'flex', gap: '40px', alignItems: 'center' },
  scoreTeamBox: { display: 'flex', alignItems: 'center', gap: '20px' },
  scoreLogo: { width: '40px', height: '40px', objectFit: 'contain', filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.5))' },
  scoreNum: { fontSize: '38px', fontWeight: '300', color: '#f8fafc' },
  timerBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '60px' },
  gameArea: { position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  pitchBackground: { position: 'absolute', borderRadius: '50%', background: 'radial-gradient(circle at center, #111827 0%, #020617 100%)', boxShadow: 'inset 0 0 50px rgba(0,255,102,0.05), 0 10px 30px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', zIndex: 1 },
  pitchGrid: { position: 'absolute', width: '100%', height: '100%', backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: 1 },
  pitchMidline: { position: 'absolute', width: '2px', height: '100%', background: 'rgba(255,255,255,0.08)', zIndex: 2 },
  pitchCenterCircle: { position: 'absolute', width: '30%', height: '30%', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.08)', zIndex: 2 },
  pitchPenaltyBoxLeft: { position: 'absolute', left: 0, width: '15%', height: '40%', border: '2px solid rgba(255,255,255,0.08)', borderLeft: 'none', zIndex: 2 },
  pitchPenaltyBoxRight: { position: 'absolute', right: 0, width: '15%', height: '40%', border: '2px solid rgba(255,255,255,0.08)', borderRight: 'none', zIndex: 2 },
  rotatingLayer: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', willChange: 'transform', zIndex: 3 },
  ball: { position: 'absolute', borderRadius: '50%', willChange: 'transform', background: 'transparent' },
  overlay: { position: 'absolute', zIndex: 100, top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(9, 9, 14, 0.95)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  finalScoreRow: { display: 'flex', alignItems: 'center', gap: '50px', marginBottom: '20px' },
  finalTeamBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', fontSize: '14px', fontWeight: '400', color: '#cbd5e1' },
  bigScore: { display: 'flex', gap: '25px', fontSize: '60px', fontWeight: '300', alignItems: 'center', color: '#fff' },
  btnSlim: { padding: '12px 30px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', background: 'transparent', color: '#00ff66', border: '1px solid #00ff66', borderRadius: '50px', textTransform: 'uppercase', transition: '0.2s', letterSpacing: '1px' },
  penaltyBoard: { zIndex: 30, display: 'flex', flexDirection: 'column', gap: '6px', background: 'transparent' },
  penRow: { display: 'flex', alignItems: 'center', gap: '6px' },
  penLogo: { width: '30px', height: '30px', objectFit: 'contain', marginRight: '15px' },
  penBox: { width: '30px', height: '30px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' },
  penTotal: { width: '35px', height: '35px', borderRadius: '50%', background: '#00ff66', color: '#000', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', marginLeft: '15px', boxShadow: '0 0 15px rgba(0,255,102,0.3)' },
  mobileLeagueTrigger: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px 24px', background: 'rgba(0, 255, 102, 0.1)', border: '1px solid #00ff66', borderRadius: '25px', color: '#00ff66', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: '0.2s', minWidth: '200px' },
  mobileLeagueModalOverlay: { position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' },
  mobileLeagueCard: { background: '#0f172a', width: '100%', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '25px 20px', paddingBottom: '40px', borderTop: '1px solid rgba(255,255,255,0.1)', animation: 'slideUp 0.3s ease-out' },
  slider: { width: '100%', cursor: 'pointer', accentColor: '#00ff66', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', outline: 'none', appearance: 'auto' }
};

export default FutebolBolinhas;