import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Skull, Award, Heart, Swords, Star, Cloud, Shield, Lock, Trophy, ArrowLeft } from 'lucide-react';

const NinjaMissionGame = () => {
  const GRID_SIZE = 15;
  const CELL_SIZE = 25;
  
  const levels = [
    {
      id: 1,
      name: "Village Outskirts",
      difficulty: "Easy",
      maze: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
        [1,0,1,1,0,1,0,1,0,1,0,1,1,0,1],
        [1,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
        [1,0,1,1,0,1,1,1,1,1,0,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,0,1,0,1,0,1,0,1,1,0,1],
        [1,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
        [1,0,1,1,0,1,1,1,1,1,0,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,0,1,0,1,0,1,0,1,1,0,1],
        [1,0,0,0,0,1,0,1,0,1,0,0,0,0,1],
        [1,0,1,1,0,0,0,0,0,0,0,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
      ],
      soldiers: [
        { x: 13, y: 1, color: '#ef4444' },
        { x: 1, y: 13, color: '#3b82f6' },
        { x: 13, y: 13, color: '#22c55e' }
      ],
      targets: [{x: 3, y: 3}, {x: 11, y: 3}, {x: 7, y: 7}]
    },
    {
      id: 2,
      name: "Temple Gardens",
      difficulty: "Medium",
      maze: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
        [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
        [1,0,1,1,1,1,0,1,0,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
        [1,1,1,1,1,0,1,1,1,0,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,0,1,1,1,0,1,1,1,1,1],
        [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,0,1,0,1,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
        [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
        [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
      ],
      soldiers: [
        { x: 13, y: 1, color: '#ef4444' },
        { x: 1, y: 13, color: '#3b82f6' },
        { x: 13, y: 13, color: '#22c55e' },
        { x: 7, y: 7, color: '#eab308' },
        { x: 7, y: 1, color: '#f97316' }
      ],
      targets: [{x: 3, y: 3}, {x: 11, y: 3}, {x: 7, y: 7}, {x: 3, y: 11}, {x: 11, y: 11}]
    },
    {
      id: 3,
      name: "Imperial Palace",
      difficulty: "Hard",
      maze: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
        [1,0,1,0,1,1,1,1,1,1,1,0,1,0,1],
        [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
        [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
        [1,0,1,0,0,0,1,0,1,0,0,0,1,0,1],
        [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
        [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
        [1,0,1,0,1,1,1,1,1,1,1,0,1,0,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
        [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
      ],
      soldiers: [
        { x: 13, y: 1, color: '#ef4444' },
        { x: 1, y: 13, color: '#3b82f6' },
        { x: 13, y: 13, color: '#22c55e' },
        { x: 7, y: 7, color: '#eab308' },
        { x: 7, y: 1, color: '#f97316' },
        { x: 1, y: 7, color: '#ec4899' },
        { x: 13, y: 7, color: '#8b5cf6' }
      ],
      targets: [{x: 2, y: 2}, {x: 12, y: 2}, {x: 7, y: 7}, {x: 2, y: 12}, {x: 12, y: 12}, {x: 7, y: 2}, {x: 7, y: 12}]
    },
    {
      id: 4,
      name: "Shogun's Fortress",
      difficulty: "Expert",
      maze: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
        [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
        [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
        [1,0,1,0,0,0,1,0,1,0,0,0,1,0,1],
        [1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
        [1,0,1,0,0,0,1,0,1,0,0,0,1,0,1],
        [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
        [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
        [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
      ],
      soldiers: [
        { x: 13, y: 1, color: '#ef4444' },
        { x: 1, y: 13, color: '#3b82f6' },
        { x: 13, y: 13, color: '#22c55e' },
        { x: 7, y: 7, color: '#eab308' },
        { x: 7, y: 1, color: '#f97316' },
        { x: 1, y: 7, color: '#ec4899' },
        { x: 13, y: 7, color: '#8b5cf6' },
        { x: 3, y: 3, color: '#06b6d4' },
        { x: 11, y: 11, color: '#10b981' }
      ],
      targets: [{x: 2, y: 2}, {x: 12, y: 2}, {x: 7, y: 7}, {x: 2, y: 12}, {x: 12, y: 12}, {x: 4, y: 7}, {x: 10, y: 7}, {x: 7, y: 4}]
    }
  ];

  const [currentScreen, setCurrentScreen] = useState('menu'); // 'menu' or 'game'
  const [currentLevel, setCurrentLevel] = useState(null);
  const [unlockedLevels, setUnlockedLevels] = useState(1);
  const [levelStars, setLevelStars] = useState({});
  
  const [ninja, setNinja] = useState({ x: 1, y: 1 });
  const [soldiers, setSoldiers] = useState([]);
  const [targets, setTargets] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [powers, setPowers] = useState({
    ninjaStars: 0,
    sword: 0,
    smokeScreen: 0,
    hidingCloth: 0
  });
  const [activePower, setActivePower] = useState(null);
  const [isInvisible, setIsInvisible] = useState(false);
  const [ninjaStarPositions, setNinjaStarPositions] = useState([]);
  const [powerAnimation, setPowerAnimation] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [clouds, setClouds] = useState([]);

  const audioContext = useRef(null);

  useEffect(() => {
    audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    
    const cloudArray = [];
    for (let i = 0; i < 5; i++) {
      cloudArray.push({
        x: Math.random() * 100,
        y: Math.random() * 40 + 10,
        speed: Math.random() * 0.5 + 0.2,
        scale: Math.random() * 0.5 + 0.5
      });
    }
    setClouds(cloudArray);
    
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setClouds(prev => prev.map(cloud => ({
        ...cloud,
        x: cloud.x > 110 ? -10 : cloud.x + cloud.speed
      })));
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  const playSound = (frequency, duration, type = 'sine') => {
    if (!audioEnabled || !audioContext.current) return;
    
    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(0.3, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration);
    
    oscillator.start(audioContext.current.currentTime);
    oscillator.stop(audioContext.current.currentTime + duration);
  };

  const playSoundSequence = (notes) => {
    if (!audioEnabled) return;
    notes.forEach((note, i) => {
      setTimeout(() => playSound(note.freq, note.duration, note.type), i * 100);
    });
  };

  const enableAudio = () => {
    if (audioContext.current && audioContext.current.state === 'suspended') {
      audioContext.current.resume();
    }
    setAudioEnabled(true);
    playSound(440, 0.1);
  };

  const startLevel = (level) => {
    const levelData = levels.find(l => l.id === level);
    if (!levelData) return;
    
    setCurrentLevel(levelData);
    setCurrentScreen('game');
    setNinja({ x: 1, y: 1 });
    setSoldiers(levelData.soldiers.map(s => ({ ...s, alive: true, confused: false })));
    setTargets([...levelData.targets]);
    setScore(0);
    setLives(3);
    setGameOver(false);
    setGameWon(false);
    setPowers({
      ninjaStars: 0,
      sword: 0,
      smokeScreen: 0,
      hidingCloth: 0
    });
    setIsInvisible(false);
    setNinjaStarPositions([]);
    setPowerAnimation(null);
  };

  const returnToMenu = () => {
    setCurrentScreen('menu');
    setCurrentLevel(null);
  };

  const getStars = (livesRemaining) => {
    if (livesRemaining === 3) return 3;
    if (livesRemaining === 2) return 2;
    return 1;
  };

  const isWall = (x, y) => {
    if (!currentLevel) return true;
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return true;
    return currentLevel.maze[y][x] === 1;
  };

  const moveNinja = useCallback((dx, dy) => {
    if (gameOver || gameWon) return;
    
    setNinja(prev => {
      const newX = prev.x + dx;
      const newY = prev.y + dy;
      if (isWall(newX, newY)) return prev;
      playSound(200, 0.05);
      return { x: newX, y: newY };
    });
  }, [gameOver, gameWon, audioEnabled, currentLevel]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (currentScreen !== 'game') return;
      
      switch(e.key) {
        case 'ArrowUp': case 'w': case 'W':
          moveNinja(0, -1);
          break;
        case 'ArrowDown': case 's': case 'S':
          moveNinja(0, 1);
          break;
        case 'ArrowLeft': case 'a': case 'A':
          moveNinja(-1, 0);
          break;
        case 'ArrowRight': case 'd': case 'D':
          moveNinja(1, 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [moveNinja, currentScreen]);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      moveNinja(deltaX > 0 ? 1 : -1, 0);
    } else {
      moveNinja(0, deltaY > 0 ? 1 : -1);
    }
    
    setTouchStart(null);
  };

  useEffect(() => {
    if (currentScreen !== 'game') return;
    
    const newTargets = targets.filter(t => !(t.x === ninja.x && t.y === ninja.y));
    if (newTargets.length < targets.length) {
      setScore(prev => prev + 10);
      setTargets(newTargets);
      
      playSoundSequence([
        { freq: 523, duration: 0.1, type: 'sine' },
        { freq: 659, duration: 0.1, type: 'sine' },
        { freq: 784, duration: 0.2, type: 'sine' }
      ]);
      
      const powerTypes = ['ninjaStars', 'sword', 'smokeScreen', 'hidingCloth'];
      const randomPower = powerTypes[Math.floor(Math.random() * powerTypes.length)];
      
      setPowerAnimation({ type: randomPower, x: ninja.x, y: ninja.y });
      setTimeout(() => setPowerAnimation(null), 1000);
      
      setPowers(prev => ({
        ...prev,
        [randomPower]: prev[randomPower] + 1
      }));
    }
    
    if (newTargets.length === 0 && targets.length > 0) {
      setGameWon(true);
      const stars = getStars(lives);
      setLevelStars(prev => ({
        ...prev,
        [currentLevel.id]: Math.max(prev[currentLevel.id] || 0, stars)
      }));
      if (currentLevel.id === unlockedLevels) {
        setUnlockedLevels(prev => Math.min(prev + 1, levels.length));
      }
      playSoundSequence([
        { freq: 523, duration: 0.15, type: 'square' },
        { freq: 659, duration: 0.15, type: 'square' },
        { freq: 784, duration: 0.15, type: 'square' },
        { freq: 1047, duration: 0.3, type: 'square' }
      ]);
    }
  }, [ninja, targets, audioEnabled, currentScreen, lives, currentLevel, unlockedLevels]);

  const usePower = (powerType) => {
    if (powers[powerType] <= 0) return;

    setPowers(prev => ({
      ...prev,
      [powerType]: prev[powerType] - 1
    }));

    switch(powerType) {
      case 'ninjaStars':
        playSound(880, 0.3, 'sawtooth');
        const directions = [
          { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
          { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
        ];
        const stars = directions.map(dir => ({
          x: ninja.x,
          y: ninja.y,
          dx: dir.dx,
          dy: dir.dy
        }));
        setNinjaStarPositions(stars);
        
        setTimeout(() => {
          const interval = setInterval(() => {
            setNinjaStarPositions(prev => {
              const updated = prev.map(star => ({
                ...star,
                x: star.x + star.dx,
                y: star.y + star.dy
              })).filter(star => !isWall(star.x, star.y));

              setSoldiers(prevSoldiers => 
                prevSoldiers.map(soldier => {
                  const hit = updated.some(star => 
                    star.x === soldier.x && star.y === soldier.y && soldier.alive
                  );
                  if (hit) {
                    playSound(150, 0.2, 'square');
                    return { ...soldier, alive: false };
                  }
                  return soldier;
                })
              );

              return updated;
            });
          }, 100);

          setTimeout(() => {
            clearInterval(interval);
            setNinjaStarPositions([]);
          }, 1000);
        }, 0);
        break;

      case 'sword':
        playSoundSequence([
          { freq: 300, duration: 0.1, type: 'sawtooth' },
          { freq: 250, duration: 0.15, type: 'sawtooth' }
        ]);
        
        const adjacentCells = [
          { x: ninja.x + 1, y: ninja.y },
          { x: ninja.x - 1, y: ninja.y },
          { x: ninja.x, y: ninja.y + 1 },
          { x: ninja.x, y: ninja.y - 1 }
        ];
        
        setSoldiers(prev => 
          prev.map(soldier => {
            const isAdjacent = adjacentCells.some(cell => 
              cell.x === soldier.x && cell.y === soldier.y
            );
            if (isAdjacent && soldier.alive) {
              playSound(150, 0.2, 'square');
              return { ...soldier, alive: false };
            }
            return soldier;
          })
        );
        setActivePower('sword');
        setTimeout(() => setActivePower(null), 500);
        break;

      case 'smokeScreen':
        playSound(100, 0.5, 'sine');
        setSoldiers(prev => prev.map(s => ({ ...s, confused: true })));
        setTimeout(() => {
          setSoldiers(prev => prev.map(s => ({ ...s, confused: false })));
        }, 5000);
        break;

      case 'hidingCloth':
        playSoundSequence([
          { freq: 600, duration: 0.1, type: 'sine' },
          { freq: 400, duration: 0.1, type: 'sine' },
          { freq: 200, duration: 0.1, type: 'sine' }
        ]);
        setIsInvisible(true);
        setTimeout(() => setIsInvisible(false), 5000);
        break;
    }
  };

  useEffect(() => {
    if (gameOver || gameWon || currentScreen !== 'game') return;

    const interval = setInterval(() => {
      setSoldiers(prev => prev.map(soldier => {
        if (!soldier.alive) return soldier;

        const directions = [
          { dx: 0, dy: -1 },
          { dx: 0, dy: 1 },
          { dx: -1, dy: 0 },
          { dx: 1, dy: 0 }
        ];

        const validMoves = directions.filter(dir => 
          !isWall(soldier.x + dir.dx, soldier.y + dir.dy)
        );

        if (validMoves.length === 0) return soldier;

        let move;
        
        if (soldier.confused) {
          move = validMoves[Math.floor(Math.random() * validMoves.length)];
        } else if (isInvisible) {
          move = validMoves[Math.floor(Math.random() * validMoves.length)];
        } else {
          const randomChance = Math.random();
          if (randomChance < 0.3) {
            move = validMoves[Math.floor(Math.random() * validMoves.length)];
          } else {
            const toNinja = validMoves.sort((a, b) => {
              const distA = Math.abs(soldier.x + a.dx - ninja.x) + Math.abs(soldier.y + a.dy - ninja.y);
              const distB = Math.abs(soldier.x + b.dx - ninja.x) + Math.abs(soldier.y + b.dy - ninja.y);
              return distA - distB;
            });
            move = toNinja[0];
          }
        }

        return {
          ...soldier,
          x: soldier.x + move.dx,
          y: soldier.y + move.dy
        };
      }));
    }, 400);

    return () => clearInterval(interval);
  }, [ninja, gameOver, gameWon, isInvisible, currentScreen, currentLevel]);

  useEffect(() => {
    if (isInvisible || currentScreen !== 'game') return;
    
    const collision = soldiers.some(s => s.x === ninja.x && s.y === ninja.y && s.alive);
    if (collision && lives > 0) {
      playSound(200, 0.3, 'square');
      setLives(prev => prev - 1);
      setNinja({ x: 1, y: 1 });
      if (currentLevel) {
        setSoldiers(currentLevel.soldiers.map(s => ({ ...s, alive: true, confused: false })));
      }
    } else if (collision && lives === 0) {
      setGameOver(true);
      playSoundSequence([
        { freq: 400, duration: 0.2, type: 'square' },
        { freq: 300, duration: 0.2, type: 'square' },
        { freq: 200, duration: 0.3, type: 'square' }
      ]);
    }
  }, [ninja, soldiers, lives, isInvisible, audioEnabled, currentScreen, currentLevel]);

  const resetGame = () => {
    if (currentLevel) {
      startLevel(currentLevel.id);
    }
  };

  const getPowerIcon = (type) => {
    switch(type) {
      case 'ninjaStars': return <Star className="w-8 h-8 text-purple-400 fill-purple-400" />;
      case 'sword': return <Swords className="w-8 h-8 text-red-400" />;
      case 'smokeScreen': return <Cloud className="w-8 h-8 text-gray-400" />;
      case 'hidingCloth': return <Shield className="w-8 h-8 text-blue-400" />;
      default: return null;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-orange-400';
      case 'Expert': return 'text-red-400';
      default: return 'text-white';
    }
  };

  if (!audioEnabled) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-cyan-300 via-blue-200 to-green-100">
        <div className="bg-gradient-to-br from-red-900 via-red-800 to-black p-8 rounded-lg text-center border-4 border-yellow-500 shadow-2xl transform hover:scale-105 transition-transform">
          <h2 className="text-4xl font-bold text-yellow-400 mb-4 animate-pulse">🥷 NINJA MISSION 🥷</h2>
          <p className="text-yellow-200 mb-6 text-lg">Prepare for your deadly quest!</p>
          <button
            onClick={enableAudio}
            className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-red-600 hover:from-yellow-400 hover:to-red-500 text-black font-bold rounded-lg text-xl transform hover:scale-110 transition-all shadow-lg border-2 border-yellow-300 animate-bounce"
          >
            START MISSION 🔊
          </button>
        </div>
      </div>
    );
  }

  if (currentScreen === 'menu') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-gradient-to-b from-cyan-300 via-blue-200 to-green-100 p-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 w-full h-64 bg-gradient-to-t from-green-800 to-green-600 opacity-30 rounded-t-full transform scale-150"></div>
          {clouds.map((cloud, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${cloud.x}%`,
                top: `${cloud.y}%`,
                transform: `scale(${cloud.scale})`
              }}
            >
              <div className="flex">
                <div className="w-12 h-12 bg-white rounded-full opacity-70"></div>
                <div className="w-16 h-16 bg-white rounded-full opacity-70 -ml-4"></div>
                <div className="w-12 h-12 bg-white rounded-full opacity-70 -ml-4"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-red-800 via-red-900 to-black px-12 py-4 rounded-full border-4 border-yellow-500 shadow-2xl mb-8 transform hover:scale-105 transition-transform relative z-10">
          <h1 className="text-5xl font-bold text-yellow-400 animate-pulse">⚔️ NINJA MISSION ⚔️</h1>
          <p className="text-center text-yellow-200 text-sm mt-2">Select Your Level</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl relative z-10">
          {levels.map((level) => {
            const isLocked = level.id > unlockedLevels;
            const stars = levelStars[level.id] || 0;
            
            return (
              <div
                key={level.id}
                className={`relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 border-4 transform transition-all ${
                  isLocked
                    ? 'border-gray-700 opacity-60 cursor-not-allowed'
                    : 'border-yellow-600 hover:scale-105 hover:shadow-2xl cursor-pointer'
                }`}
                onClick={() => !isLocked && startLevel(level.id)}
              >
                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg z-10">
                    <Lock className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold text-yellow-400">Level {level.id}</h3>
                  <span className={`text-sm font-bold ${getDifficultyColor(level.difficulty)}`}>
                    {level.difficulty}
                  </span>
                </div>
                
                <p className="text-white text-lg mb-3">{level.name}</p>
                
                <div className="flex items-center justify-between text-gray-300 text-sm mb-3">
                  <div className="flex items-center gap-1">
                    <Skull className="w-4 h-4 text-red-400" />
                    <span>{level.targets.length} Targets</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span>{level.soldiers.length} Guards</span>
                  </div>
                </div>
                
                {!isLocked && (
                  <div className="flex gap-1 justify-center">
                    {[1, 2, 3].map((star) => (
                      <Trophy
                        key={star}
                        className={`w-6 h-6 ${
                          star <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center text-gray-800 text-sm font-bold relative z-10 bg-white bg-opacity-80 px-6 py-3 rounded-lg">
          <p>⭐ Complete levels with 3 lives for maximum stars!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-gradient-to-b from-cyan-300 via-blue-200 to-green-100 p-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 w-full h-64 bg-gradient-to-t from-green-800 to-green-600 opacity-30 rounded-t-full transform scale-150"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-80 bg-gradient-to-t from-green-700 to-green-500 opacity-40 rounded-t-full"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-72 bg-gradient-to-t from-green-700 to-green-500 opacity-40 rounded-t-full"></div>
        
        {clouds.map((cloud, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${cloud.x}%`,
              top: `${cloud.y}%`,
              transform: `scale(${cloud.scale})`
            }}
          >
            <div className="flex">
              <div className="w-12 h-12 bg-white rounded-full opacity-70"></div>
              <div className="w-16 h-16 bg-white rounded-full opacity-70 -ml-4"></div>
              <div className="w-12 h-12 bg-white rounded-full opacity-70 -ml-4"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 text-center relative z-10 w-full max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={returnToMenu}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-bold transition-all transform hover:scale-105 border-2 border-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
            Menu
          </button>
          
          <div className="bg-gradient-to-r from-red-800 via-red-900 to-black px-6 py-2 rounded-full border-4 border-yellow-500 shadow-2xl">
            <h1 className="text-2xl font-bold text-yellow-400">Level {currentLevel?.id}: {currentLevel?.name}</h1>
          </div>
          
          <div className={`px-4 py-2 rounded-lg font-bold ${getDifficultyColor(currentLevel?.difficulty)} bg-black bg-opacity-50 border-2 border-yellow-600`}>
            {currentLevel?.difficulty}
          </div>
        </div>
        
        <div className="flex gap-4 justify-center items-center text-white mb-4 flex-wrap">
          <div className="flex items-center gap-2 bg-black bg-opacity-50 px-4 py-2 rounded-full border-2 border-yellow-500 transform hover:scale-110 transition-all">
            <Award className="w-6 h-6 text-yellow-400" />
            <span className="font-bold text-xl text-yellow-300">{score}</span>
          </div>
          <div className="flex items-center gap-2 bg-black bg-opacity-50 px-4 py-2 rounded-full border-2 border-red-500 transform hover:scale-110 transition-all">
            <Skull className="w-6 h-6 text-red-400 animate-pulse" />
            <span className="font-bold text-xl text-red-300">{targets.length}</span>
          </div>
          <div className="flex items-center gap-1 bg-black bg-opacity-50 px-4 py-2 rounded-full border-2 border-pink-500 transform hover:scale-110 transition-all">
            {[...Array(3)].map((_, i) => (
              <Heart 
                key={i} 
                className={`w-6 h-6 transition-all ${i < lives ? 'text-red-500 fill-red-500 animate-pulse' : 'text-gray-600'}`} 
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => usePower('ninjaStars')}
            disabled={powers.ninjaStars === 0}
            className={`relative flex items-center gap-2 px-4 py-3 rounded-lg transition-all transform ${
              powers.ninjaStars > 0 
                ? 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 hover:scale-110 shadow-lg border-2 border-purple-300 cursor-pointer' 
                : 'bg-gray-800 border-2 border-gray-600 cursor-not-allowed opacity-50'
            } text-white font-bold`}
          >
            <Star className="w-5 h-5" />
            <span className="text-lg">⭐ {powers.ninjaStars}</span>
          </button>
          
          <button
            onClick={() => usePower('sword')}
            disabled={powers.sword === 0}
            className={`relative flex items-center gap-2 px-4 py-3 rounded-lg transition-all transform ${
              powers.sword > 0 
                ? 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 hover:scale-110 shadow-lg border-2 border-red-300 cursor-pointer' 
                : 'bg-gray-800 border-2 border-gray-600 cursor-not-allowed opacity-50'
            } text-white font-bold`}
          >
            <Swords className="w-5 h-5" />
            <span className="text-lg">⚔️ {powers.sword}</span>
          </button>
          
          <button
            onClick={() => usePower('smokeScreen')}
            disabled={powers.smokeScreen === 0}
            className={`relative flex items-center gap-2 px-4 py-3 rounded-lg transition-all transform ${
              powers.smokeScreen > 0 
                ? 'bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 hover:scale-110 shadow-lg border-2 border-gray-300 cursor-pointer' 
                : 'bg-gray-800 border-2 border-gray-600 cursor-not-allowed opacity-50'
            } text-white font-bold`}
          >
            <Cloud className="w-5 h-5" />
            <span className="text-lg">💨 {powers.smokeScreen}</span>
          </button>
          
          <button
            onClick={() => usePower('hidingCloth')}
            disabled={powers.hidingCloth === 0}
            className={`relative flex items-center gap-2 px-4 py-3 rounded-lg transition-all transform ${
              powers.hidingCloth > 0 
                ? 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 hover:scale-110 shadow-lg border-2 border-blue-300 cursor-pointer' 
                : 'bg-gray-800 border-2 border-gray-600 cursor-not-allowed opacity-50'
            } text-white font-bold`}
          >
            <Shield className="w-5 h-5" />
            <span className="text-lg">🛡️ {powers.hidingCloth}</span>
          </button>
        </div>
      </div>

      <div 
        className="relative border-8 shadow-2xl"
        style={{ 
          width: GRID_SIZE * CELL_SIZE, 
          height: GRID_SIZE * CELL_SIZE,
          borderColor: '#8B4513',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0f766e 100%)'
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {currentLevel && currentLevel.maze.map((row, y) =>
          row.map((cell, x) =>
            cell === 1 ? (
              <div
                key={`${x}-${y}`}
                className="absolute"
                style={{
                  left: x * CELL_SIZE,
                  top: y * CELL_SIZE,
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #7f1d1d 100%)',
                  borderTop: '2px solid #dc2626',
                  borderLeft: '1px solid #dc2626',
                  boxShadow: 'inset 0 0 5px rgba(0,0,0,0.5)'
                }}
              />
            ) : null
          )
        )}

        {targets.map((target, i) => (
          <div
            key={i}
            className="absolute flex items-center justify-center animate-pulse"
            style={{
              left: target.x * CELL_SIZE,
              top: target.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE
            }}
          >
            <Skull className="w-4 h-4 text-red-600" />
          </div>
        ))}

        {powerAnimation && (
          <div
            className="absolute flex items-center justify-center z-50"
            style={{
              left: powerAnimation.x * CELL_SIZE,
              top: powerAnimation.y * CELL_SIZE,
              width: CELL_SIZE * 2,
              height: CELL_SIZE * 2,
              marginLeft: -CELL_SIZE / 2,
              marginTop: -CELL_SIZE / 2,
              animation: 'bounce 1s ease-out'
            }}
          >
            {getPowerIcon(powerAnimation.type)}
          </div>
        )}

        {ninjaStarPositions.map((star, i) => (
          <div
            key={i}
            className="absolute flex items-center justify-center"
            style={{
              left: star.x * CELL_SIZE,
              top: star.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE
            }}
          >
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-spin" />
          </div>
        ))}

        {soldiers.map((soldier, i) => (
          soldier.alive && (
            <div
              key={i}
              className={`absolute transition-all duration-100 ${soldier.confused ? 'animate-spin' : ''}`}
              style={{
                left: soldier.x * CELL_SIZE,
                top: soldier.y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
                opacity: soldier.confused ? 0.6 : 1
              }}
            >
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <circle cx="12" cy="8" r="3" fill={soldier.color} />
                <rect x="9" y="11" width="6" height="8" rx="1" fill={soldier.color} />
                <rect x="6" y="12" width="3" height="5" rx="1" fill={soldier.color} />
                <rect x="15" y="12" width="3" height="5" rx="1" fill={soldier.color} />
                <rect x="9" y="19" width="2.5" height="4" rx="1" fill={soldier.color} />
                <rect x="12.5" y="19" width="2.5" height="4" rx="1" fill={soldier.color} />
                <circle cx="12" cy="7" r="3.5" fill="none" stroke="#333" strokeWidth="0.5" />
              </svg>
            </div>
          )
        ))}

        <div
          className={`absolute transition-all duration-100 ${activePower === 'sword' ? 'scale-125 animate-pulse' : ''}`}
          style={{
            left: ninja.x * CELL_SIZE,
            top: ninja.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
            opacity: isInvisible ? 0.3 : 1
          }}
        >
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <circle cx="12" cy="8" r="3" fill="#000" />
            <rect x="9" y="11" width="6" height="8" rx="1" fill="#000" />
            <rect x="6" y="12" width="3" height="5" rx="1" fill="#000" />
            <rect x="15" y="12" width="3" height="5" rx="1" fill="#000" />
            <rect x="9" y="19" width="2.5" height="4" rx="1" fill="#000" />
            <rect x="12.5" y="19" width="2.5" height="4" rx="1" fill="#000" />
            <circle cx="10.5" cy="8" r="0.8" fill="#ff0000" />
            <circle cx="13.5" cy="8" r="0.8" fill="#ff0000" />
            <rect x="8" y="5.5" width="8" height="1" fill="#333" />
          </svg>
        </div>

        {(gameOver || gameWon) && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center">
            <h2 className={`text-4xl font-bold mb-4 animate-bounce ${gameWon ? 'text-green-400' : 'text-red-400'}`}>
              {gameWon ? '🎉 Level Complete! 🎉' : '💀 Mission Failed 💀'}
            </h2>
            {gameWon && (
              <div className="flex gap-2 mb-4">
                {[1, 2, 3].map((star) => (
                  <Trophy
                    key={star}
                    className={`w-12 h-12 ${
                      star <= getStars(lives) ? 'text-yellow-400 fill-yellow-400 animate-bounce' : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
            )}
            <p className="text-2xl text-white mb-6">Score: {score}</p>
            <div className="flex gap-4">
              <button
                onClick={returnToMenu}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition-transform hover:scale-110 border-2 border-gray-500"
              >
                Menu
              </button>
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-transform hover:scale-110 border-2 border-blue-400"
              >
                Retry
              </button>
              {gameWon && currentLevel && currentLevel.id < levels.length && (
                <button
                  onClick={() => startLevel(currentLevel.id + 1)}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-transform hover:scale-110 border-2 border-green-400"
                >
                  Next Level
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-center text-gray-800 text-sm font-bold relative z-10">
        <p className="mb-2">Desktop: Arrow keys or WASD to move</p>
        <p>Mobile: Swipe to move • Tap power buttons to use</p>
      </div>
    </div>
  );
};

export default NinjaMissionGame;