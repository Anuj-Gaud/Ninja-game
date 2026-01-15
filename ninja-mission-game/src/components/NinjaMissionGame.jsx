import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Skull, Award, Heart, Swords, Star, Cloud, Shield, Lock, Trophy, ArrowLeft, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Hammer } from 'lucide-react';

const NinjaMissionGame = () => {
  const GRID_SIZE = 15;
  const [cellSize, setCellSize] = useState(30);
  
  // Dynamic maze generation function
  const generateMaze = (level) => {
    // Initialize maze with walls
    const maze = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(1));
    
    // Create paths using randomized algorithm
    const carvePath = (x, y) => {
      const directions = [
        [0, -2], [0, 2], [-2, 0], [2, 0]
      ].sort(() => Math.random() - 0.5);
      
      directions.forEach(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
        
        if (nx > 0 && nx < GRID_SIZE - 1 && ny > 0 && ny < GRID_SIZE - 1 && maze[ny][nx] === 1) {
          maze[y + dy/2][x + dx/2] = 0;
          maze[ny][nx] = 0;
          carvePath(nx, ny);
        }
      });
    };
    
    // Start carving from center-ish area
    const startX = Math.floor(GRID_SIZE / 4) * 2 + 1;
    const startY = Math.floor(GRID_SIZE / 4) * 2 + 1;
    maze[startY][startX] = 0;
    carvePath(startX, startY);
    
    // Add some random openings for more paths (simpler for lower levels)
    let openings;
    if (level <= 2) {
      openings = Math.max(1, level); // Very few openings for easy levels
    } else {
      openings = Math.min(level * 2, 8); // More openings for harder levels
    }

    for (let i = 0; i < openings; i++) {
      const x = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
      const y = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
      if (maze[y][x] === 1) {
        maze[y][x] = 0;
      }
    }

    // For easy levels, create some guaranteed open corridors
    if (level === 1) {
      // Create horizontal corridor in the middle
      for (let x = 2; x < GRID_SIZE - 2; x++) {
        maze[Math.floor(GRID_SIZE / 2)][x] = 0;
      }
      // Create vertical corridor in the middle
      for (let y = 2; y < GRID_SIZE - 2; y++) {
        maze[y][Math.floor(GRID_SIZE / 2)] = 0;
      }
    }

    // For medium levels, add fewer random walls back
    if (level === 2) {
      // Add back some walls to create rooms but keep it navigable
      const wallsToAdd = 3;
      for (let i = 0; i < wallsToAdd; i++) {
        const x = Math.floor(Math.random() * (GRID_SIZE - 4)) + 2;
        const y = Math.floor(Math.random() * (GRID_SIZE - 4)) + 2;
        if (maze[y][x] === 0 && !(x === Math.floor(GRID_SIZE / 2) && y === Math.floor(GRID_SIZE / 2))) {
          maze[y][x] = 1;
        }
      }
    }
    
    // Ensure outer walls are solid
    for (let i = 0; i < GRID_SIZE; i++) {
      maze[0][i] = 1;
      maze[GRID_SIZE - 1][i] = 1;
      maze[i][0] = 1;
      maze[i][GRID_SIZE - 1] = 1;
    }
    
    return maze;
  };
  
  // Generate soldiers based on level (gentler scaling for beginners)
  const generateSoldiers = (level, maze) => {
    const soldiers = [];
    const soldierColors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#f97316', '#ec4899', '#8b5cf6', '#06b6d4'];

    // Gentler scaling: fewer soldiers in early levels
    let soldierCount;
    if (level === 1) soldierCount = 2; // Very easy start
    else if (level === 2) soldierCount = 3; // Still manageable
    else soldierCount = Math.min(3 + Math.floor((level - 2) / 2), 8); // Normal scaling after level 2

    for (let i = 0; i < soldierCount; i++) {
      let x, y, attempts = 0;
      do {
        x = Math.floor(Math.random() * (GRID_SIZE - 4)) + 2;
        y = Math.floor(Math.random() * (GRID_SIZE - 4)) + 2;
        attempts++;
      } while ((maze[y][x] === 1 || (x === 1 && y === 1)) && attempts < 50);

      if (attempts < 50) {
        soldiers.push({
          x,
          y,
          color: soldierColors[i % soldierColors.length]
        });
      }
    }

    return soldiers;
  };
  
  // Generate targets based on level (gentler for beginners)
  const generateTargets = (level, maze) => {
    const targets = [];

    // Gentler scaling: fewer targets in early levels
    let targetCount;
    if (level === 1) targetCount = 2; // Very easy start
    else if (level === 2) targetCount = 3; // Still manageable
    else targetCount = Math.min(3 + Math.floor((level - 2) / 3), 7); // Normal scaling after level 2

    for (let i = 0; i < targetCount; i++) {
      let x, y, attempts = 0;
      do {
        x = Math.floor(Math.random() * (GRID_SIZE - 4)) + 2;
        y = Math.floor(Math.random() * (GRID_SIZE - 4)) + 2;
        attempts++;
      } while (((x === 1 && y === 1) || maze[y][x] === 1) && attempts < 50);

      if (attempts < 50) {
        targets.push({ x, y });
      }
    }

    return targets;
  };
  
  // Dynamic level generation
  const generateLevel = (levelId) => {
    const maze = generateMaze(levelId);
    const soldiers = generateSoldiers(levelId, maze);
    const targets = generateTargets(levelId, maze);
    
    const difficultyNames = ["Easy", "Medium", "Hard", "Expert"];
    const difficulty = difficultyNames[Math.min(Math.floor((levelId - 1) / 3), 3)];
    
    const levelNames = [
      "Village Outskirts", "Temple Gardens", "Imperial Palace", "Shogun's Fortress",
      "Mountain Pass", "Hidden Valley", "Dragon's Lair", "Forbidden Temple",
      "Shadow Realm", "Eternal Maze", "Ninja Sanctuary", "Dojo of Death"
    ];
    
    return {
      id: levelId,
      name: levelNames[(levelId - 1) % levelNames.length] || `Level ${levelId}`,
      difficulty,
      maze,
      soldiers,
      targets
    };
  };
  
  // Generate levels dynamically
  const [levels, setLevels] = useState([]);
  const [unlockedLevels, setUnlockedLevels] = useState(1);

  // Generate levels on component mount
  useEffect(() => {
    const generatedLevels = [];
    for (let i = 1; i <= 10; i++) {
      generatedLevels.push(generateLevel(i));
    }
    setLevels(generatedLevels);
  }, []);

  const [currentScreen, setCurrentScreen] = useState('menu'); // 'menu' or 'game'
  const [currentLevel, setCurrentLevel] = useState(null);
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
    hidingCloth: 0,
    wallBreaker: 0
  });
  const [activePower, setActivePower] = useState(null);
  const [isInvisible, setIsInvisible] = useState(false);
  const [ninjaStarPositions, setNinjaStarPositions] = useState([]);
  const [powerAnimation, setPowerAnimation] = useState(null);
  const [brokenWalls, setBrokenWalls] = useState([]);
  const brokenWallsRef = useRef([]);
  const [soldiersAttracted, setSoldiersAttracted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(true);
  const [audioVolume, setAudioVolume] = useState(0.5);
  const [showAudioControls, setShowAudioControls] = useState(false);
  const [clouds, setClouds] = useState([]);

  const audioContext = useRef(null);
  const bgMusicRef = useRef(null);

  useEffect(() => {
    const updateCellSize = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const isLandscape = viewportWidth > viewportHeight;

      // Calculate available space for maze (accounting for UI elements)
      let availableWidth, availableHeight;

      if (isLandscape) {
        // Landscape: maze takes up most of the screen, buttons on sides
        availableWidth = viewportWidth * 0.6; // 60% for maze
        availableHeight = viewportHeight * 0.75; // 75% for maze (leaving space for top UI)
      } else {
        // Portrait: maze takes full width, buttons below
        availableWidth = viewportWidth * 0.95; // 95% of screen width
        availableHeight = viewportHeight * 0.6; // 60% of screen height (leaving space for UI)
      }

      // Calculate optimal cell size
      const maxSize = Math.min(availableWidth, availableHeight) / GRID_SIZE;

      // Responsive sizing based on screen size
      let optimalSize;
      if (viewportWidth < 480) {
        // Mobile phones
        optimalSize = Math.max(16, Math.min(maxSize, 24));
      } else if (viewportWidth < 768) {
        // Tablets
        optimalSize = Math.max(20, Math.min(maxSize, 32));
      } else if (viewportWidth < 1024) {
        // Small laptops
        optimalSize = Math.max(24, Math.min(maxSize, 36));
      } else {
        // Large screens
        optimalSize = Math.max(28, Math.min(maxSize, 40));
      }

      setCellSize(optimalSize);
    };

    updateCellSize();
    window.addEventListener('resize', updateCellSize);
    window.addEventListener('orientationchange', updateCellSize);

    return () => {
      window.removeEventListener('resize', updateCellSize);
      window.removeEventListener('orientationchange', updateCellSize);
    };
  }, []);

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
    
    // Auto-play audio on mount
    setTimeout(() => {
      if (bgMusicRef.current) {
        bgMusicRef.current.volume = 0.5;
        bgMusicRef.current.play().catch(e => console.log('Auto-play prevented:', e.code));
      }
    }, 500);
    
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

  const playClickSound = () => {
    playSound(800, 0.1, 'sine');
  };

  const enableAudio = () => {
    console.log('enableAudio called');
    if (audioContext.current && audioContext.current.state === 'suspended') {
      audioContext.current.resume();
    }
    setAudioEnabled(true);
    playSound(440, 0.1);
    
    // Attempt to play music with delay for state update
    setTimeout(() => {
      if (bgMusicRef.current) {
        console.log('Attempting to play background music...');
        bgMusicRef.current.volume = 1.0;
        bgMusicRef.current.currentTime = 0;
        bgMusicRef.current.muted = false; // Ensure not muted
        const playPromise = bgMusicRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('✅ Music playing successfully');
              console.log('Current time:', bgMusicRef.current.currentTime);
              console.log('Volume:', bgMusicRef.current.volume);
            })
            .catch(e => {
              console.error('❌ Failed to play background music:', e);
              console.error('Error code:', e.code);
              // Try again after a short delay
              setTimeout(() => {
                if (bgMusicRef.current) {
                  console.log('Retrying music playback...');
                  bgMusicRef.current.play().catch(err => console.error('Retry failed:', err));
                }
              }, 500);
            });
        }
      } else {
        console.error('bgMusicRef.current is null');
      }
    }, 100);
  };

  // Handle audio play/pause
  useEffect(() => {
    if (bgMusicRef.current) {
      if (isAudioPlaying) {
        bgMusicRef.current.play().catch(e => console.log('Play failed', e));
      } else {
        bgMusicRef.current.pause();
      }
    }
  }, [isAudioPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = audioVolume;
    }
  }, [audioVolume]);

  useEffect(() => {
    if (audioEnabled && bgMusicRef.current) {
      bgMusicRef.current.volume = audioVolume;
      const playPromise = bgMusicRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => console.log('Background music play failed', e));
      }
    } else if (!audioEnabled && bgMusicRef.current) {
      bgMusicRef.current.pause();
    }
  }, [audioEnabled, audioVolume]);

  // Auto-play music on component mount
  useEffect(() => {
    const attemptAutoPlay = () => {
      if (bgMusicRef.current && audioEnabled) {
        bgMusicRef.current.volume = audioVolume;
        console.log('🎵 Attempting to auto-play music...');
        const playPromise = bgMusicRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('🎵 Music auto-started successfully!');
              setIsAudioPlaying(true);
            })
            .catch(err => {
              console.log('⚠️ Auto-play blocked by browser, waiting for user interaction', err);
              // Try again on user interaction
              const handleUserInteraction = () => {
                const play = bgMusicRef.current?.play();
                if (play !== undefined) {
                  play.then(() => {
                    console.log('🎵 Music started after user interaction');
                    setIsAudioPlaying(true);
                    document.removeEventListener('click', handleUserInteraction);
                    document.removeEventListener('touchstart', handleUserInteraction);
                  }).catch(e => console.log('Still unable to play', e));
                }
              };
              document.addEventListener('click', handleUserInteraction, { once: true });
              document.addEventListener('touchstart', handleUserInteraction, { once: true });
            });
        }
      }
    };
    
    // Give audio element time to be ready
    const timeout = setTimeout(attemptAutoPlay, 500);
    return () => clearTimeout(timeout);
  }, [audioEnabled, audioVolume]);

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
      hidingCloth: 0,
      wallBreaker: 1
    });
    setIsInvisible(false);
    setNinjaStarPositions([]);
    setPowerAnimation(null);
    setBrokenWalls([]);
    brokenWallsRef.current = [];
    setSoldiersAttracted(false);
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
    // Check if wall is broken - if yes, treat as passable
    if (brokenWallsRef.current.some(bw => bw.x === x && bw.y === y)) return false;
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
      
      const powerTypes = ['ninjaStars', 'sword', 'smokeScreen', 'hidingCloth', 'wallBreaker'];
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

      case 'wallBreaker':
        playSoundSequence([
          { freq: 150, duration: 0.1, type: 'sawtooth' },
          { freq: 100, duration: 0.2, type: 'sawtooth' }
        ]);
        
        const adjacentWalls = [
          { x: ninja.x + 1, y: ninja.y },
          { x: ninja.x - 1, y: ninja.y },
          { x: ninja.x, y: ninja.y + 1 },
          { x: ninja.x, y: ninja.y - 1 }
        ];
        
        const wallsToBreak = adjacentWalls.filter(cell => 
          currentLevel && currentLevel.maze[cell.y] && currentLevel.maze[cell.y][cell.x] === 1 &&
          !brokenWallsRef.current.some(bw => bw.x === cell.x && bw.y === cell.y)
        );
        
        if (wallsToBreak.length > 0) {
          brokenWallsRef.current = [...brokenWallsRef.current, ...wallsToBreak];
          setBrokenWalls(brokenWallsRef.current);
          setSoldiersAttracted(true);
          setTimeout(() => setSoldiersAttracted(false), 10000); // Attract soldiers for 10 seconds
        }
        
        setActivePower('wallBreaker');
        setTimeout(() => setActivePower(null), 500);
        break;
    }
  };

  useEffect(() => {
    if (gameOver || gameWon || currentScreen !== 'game') return;

    const moveInterval = soldiersAttracted ? 200 : 400;
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
          const toNinja = validMoves.sort((a, b) => {
            const distA = Math.abs(soldier.x + a.dx - ninja.x) + Math.abs(soldier.y + a.dy - ninja.y);
            const distB = Math.abs(soldier.x + b.dx - ninja.x) + Math.abs(soldier.y + b.dy - ninja.y);
            return distA - distB;
          });
          move = toNinja[0];
        }

        return {
          ...soldier,
          x: soldier.x + move.dx,
          y: soldier.y + move.dy
        };
      }));
    }, moveInterval);

    return () => clearInterval(interval);
  }, [ninja, gameOver, gameWon, isInvisible, currentScreen, currentLevel, soldiersAttracted]);

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
      case 'wallBreaker': return <Hammer className="w-8 h-8 text-orange-400" />;
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

  // Render main content based on current state
  const getMainContent = () => {
    if (!audioEnabled) {
      return (
        <div className="h-screen w-screen bg-gradient-to-b from-cyan-300 via-blue-200 to-green-100 flex items-center justify-center landscape:flex landscape:flex-col landscape:justify-center landscape:items-center">
          <div className="bg-gradient-to-br from-red-900 via-red-800 to-black p-8 rounded-lg text-center border-4 border-yellow-500 shadow-2xl transform hover:scale-105 transition-transform">
            <h2 className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-4 animate-pulse">🥷 NINJA MISSION 🥷</h2>
            <p className="text-yellow-200 mb-6 text-base sm:text-lg">Prepare for your deadly quest!</p>
            <button
              onClick={() => { playClickSound(); enableAudio(); }}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-yellow-500 to-red-600 hover:from-yellow-400 hover:to-red-500 active:scale-95 text-black font-bold rounded-lg text-lg sm:text-xl transform hover:scale-110 transition-all shadow-lg border-2 border-yellow-300 animate-bounce touch-none"
            >
              START MISSION 🔊
            </button>
          </div>
        </div>
      );
    }

    if (currentScreen === 'menu') {
      return (
        <div className="h-screen w-screen bg-gradient-to-b from-cyan-300 via-blue-200 to-green-100 overflow-y-auto relative landscape:flex landscape:flex-col landscape:justify-center landscape:items-center p-4">
        {/* Audio Control Button (Speaker Icon) */}
        <button
          onClick={() => { playClickSound(); setShowAudioControls(!showAudioControls); }}
          className="absolute top-4 right-4 z-30 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white rounded-full shadow-lg border-3 border-blue-400 flex items-center justify-center text-2xl sm:text-3xl transform hover:scale-110 active:scale-95 transition-all animate-pulse"
        >
          {isAudioPlaying ? '🔊' : '🔇'}
        </button>

        {/* Audio Controls Popup */}
        {showAudioControls && (
          <div className="absolute top-20 right-4 z-40 bg-gradient-to-br from-gray-900 to-black p-6 rounded-lg border-3 border-blue-400 shadow-2xl w-80"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">🎵 Audio Control</h3>
              <button
                onClick={() => setShowAudioControls(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Play/Pause Button */}
              <button
                onClick={() => { playClickSound(); setIsAudioPlaying(!isAudioPlaying); }}
                className={`w-full py-3 rounded-lg font-bold text-white transition-all transform hover:scale-105 border-2 ${
                  isAudioPlaying
                    ? 'bg-gradient-to-r from-green-600 to-green-700 border-green-400'
                    : 'bg-gradient-to-r from-red-600 to-red-700 border-red-400'
                }`}
              >
                {isAudioPlaying ? '⏸ Pause Music' : '▶ Play Music'}
              </button>
              
              {/* Volume Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-white font-bold">Volume</label>
                  <span className="text-blue-400 font-bold">{Math.round(audioVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={audioVolume * 100}
                  onChange={(e) => { playClickSound(); setAudioVolume(e.target.value / 100); }}
                  className="w-full h-3 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  style={{
                    background: `linear-gradient(to right, #2563eb 0%, #2563eb ${audioVolume * 100}%, #4b5563 ${audioVolume * 100}%, #4b5563 100%)`
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {showAudioControls && (
          <div 
            className="fixed inset-0 z-20" 
            onClick={() => setShowAudioControls(false)}
          ></div>
        )}
        {/* Scrolling Background Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Animated Mountains/Background */}
          <div className="absolute bottom-0 w-full h-64 bg-gradient-to-t from-green-800 to-green-600 opacity-30 rounded-t-full transform scale-150 animate-pulse"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-80 bg-gradient-to-t from-green-700 to-green-500 opacity-40 rounded-t-full animate-bounce" style={{animationDuration: '8s'}}></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-72 bg-gradient-to-t from-green-700 to-green-500 opacity-40 rounded-t-full animate-bounce" style={{animationDuration: '10s'}}></div>
          
          {/* Floating Clouds with Animation */}
          {clouds.map((cloud, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${cloud.x}%`,
                top: `${cloud.y}%`,
                transform: `scale(${cloud.scale}) translateX(${Math.sin(Date.now() * 0.001 + i) * 20}px)`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`
              }}
            >
              <div className="flex">
                <div className="w-12 h-12 bg-white rounded-full opacity-70"></div>
                <div className="w-16 h-16 bg-white rounded-full opacity-70 -ml-4"></div>
                <div className="w-12 h-12 bg-white rounded-full opacity-70 -ml-4"></div>
              </div>
            </div>
          ))}
          
          {/* Scrolling Ninja Silhouettes */}
          <div className="absolute bottom-20 left-0 w-full h-20 overflow-hidden">
            <div className="flex animate-bounce" style={{animationDuration: '15s'}}>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex-shrink-0 mx-8 opacity-20">
                  <div className="w-8 h-12 bg-black rounded-t-full transform rotate-12"></div>
                  <div className="w-6 h-8 bg-black rounded-b-full -mt-2 ml-1"></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-30 animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-800 via-red-900 to-black px-6 sm:px-12 py-3 sm:py-4 rounded-full border-4 border-yellow-500 shadow-2xl mb-6 sm:mb-8 transform hover:scale-105 active:scale-95 transition-transform relative z-10">
          <h1 className="text-3xl sm:text-5xl font-bold text-yellow-400 animate-pulse">⚔️ NINJA MISSION ⚔️</h1>
          <p className="text-center text-yellow-200 text-xs sm:text-sm mt-2">Select Your Level</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl relative z-10 landscape:grid-cols-2 landscape:gap-4 sm:landscape:gap-8 px-2 sm:px-0">
          {levels.map((level) => {
            const isLocked = level.id > unlockedLevels;
            const stars = levelStars[level.id] || 0;
            
            return (
              <div
                key={level.id}
                className={`relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-4 sm:p-6 border-4 transform transition-all ${
                  isLocked
                    ? 'border-gray-700 opacity-60 cursor-not-allowed'
                    : 'border-yellow-600 hover:scale-105 hover:shadow-2xl cursor-pointer active:scale-95'
                }`}
                onClick={() => { playClickSound(); !isLocked && startLevel(level.id); }}
              >
                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg z-10">
                    <Lock className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-yellow-400">Level {level.id}</h3>
                  <span className={`text-xs sm:text-sm font-bold ${getDifficultyColor(level.difficulty)}`}>
                    {level.difficulty}
                  </span>
                </div>
                
                <p className="text-white text-base sm:text-lg mb-3">{level.name}</p>
                
                <div className="flex items-center justify-between text-gray-300 text-xs sm:text-sm mb-3 gap-2 flex-wrap">
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

    // Game screen
    return (
      <div className="min-h-screen w-screen bg-gradient-to-b from-cyan-300 via-blue-200 to-green-100 overflow-hidden relative">
      {/* Game Info - Top */}
      <div className="absolute top-1 sm:top-2 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-4xl px-2 sm:px-4 transition-all duration-300">
        <div className="flex items-center justify-between mb-2 sm:mb-4 gap-2 sm:gap-4 flex-wrap">
          <button
            onClick={() => { playClickSound(); returnToMenu(); }}
            className="flex items-center gap-1 sm:gap-2 bg-gray-800 hover:bg-gray-700 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-bold transition-all transform hover:scale-105 border-2 border-gray-600 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Menu
          </button>
          
          <div className="bg-gradient-to-r from-red-800 via-red-900 to-black px-3 sm:px-6 py-1 sm:py-2 rounded-full border-2 sm:border-4 border-yellow-500 shadow-2xl">
            <h1 className="text-lg sm:text-2xl font-bold text-yellow-400">Level {currentLevel?.id}: {currentLevel?.name}</h1>
          </div>
          
          {/* Audio Control Button (Speaker Icon) */}
          <button
            onClick={() => { playClickSound(); setShowAudioControls(!showAudioControls); }}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white rounded-full shadow-lg border-2 border-blue-400 flex items-center justify-center text-xl sm:text-2xl transform hover:scale-110 active:scale-95 transition-all"
          >
            {isAudioPlaying ? '🔊' : '🔇'}
          </button>
          
          <div className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-bold text-sm sm:text-base ${getDifficultyColor(currentLevel?.difficulty)} bg-black bg-opacity-50 border-2 border-yellow-600`}>
            {currentLevel?.difficulty}
          </div>
        </div>
        
        <div className="flex gap-2 sm:gap-4 justify-center items-center text-white mb-2 sm:mb-4 flex-wrap">
          <div className="flex items-center gap-1 sm:gap-2 bg-black bg-opacity-50 px-2 sm:px-4 py-1 sm:py-2 rounded-full border-2 border-yellow-500 transform hover:scale-110 transition-all">
            <Award className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400" />
            <span className="font-bold text-sm sm:text-xl text-yellow-300">{score}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 bg-black bg-opacity-50 px-2 sm:px-4 py-1 sm:py-2 rounded-full border-2 border-red-500 transform hover:scale-110 transition-all">
            <Skull className="w-4 h-4 sm:w-6 sm:h-6 text-red-400 animate-pulse" />
            <span className="font-bold text-sm sm:text-xl text-red-300">{targets.length}</span>
          </div>
          <div className="flex items-center gap-1 bg-black bg-opacity-50 px-2 sm:px-4 py-1 sm:py-2 rounded-full border-2 border-pink-500 transform hover:scale-110 transition-all">
            {[...Array(3)].map((_, i) => (
              <Heart 
                key={i} 
                className={`w-4 h-4 sm:w-6 sm:h-6 transition-all ${i < lives ? 'text-red-500 fill-red-500 animate-pulse' : 'text-gray-600'}`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Audio Controls Popup */}
      {showAudioControls && (
        <div className="fixed top-20 right-4 z-40 bg-gradient-to-br from-gray-900 to-black p-6 rounded-lg border-3 border-blue-400 shadow-2xl w-80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-lg">🎵 Audio Control</h3>
            <button
              onClick={() => setShowAudioControls(false)}
              className="text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Play/Pause Button */}
            <button
              onClick={() => { playClickSound(); setIsAudioPlaying(!isAudioPlaying); }}
              className={`w-full py-3 rounded-lg font-bold text-white transition-all transform hover:scale-105 border-2 ${
                isAudioPlaying
                  ? 'bg-gradient-to-r from-green-600 to-green-700 border-green-400'
                  : 'bg-gradient-to-r from-red-600 to-red-700 border-red-400'
              }`}
            >
              {isAudioPlaying ? '⏸ Pause Music' : '▶ Play Music'}
            </button>
            
            {/* Volume Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-white font-bold">Volume</label>
                <span className="text-blue-400 font-bold">{Math.round(audioVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={audioVolume * 100}
                onChange={(e) => { playClickSound(); setAudioVolume(e.target.value / 100); }}
                className="w-full h-3 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                style={{
                  background: `linear-gradient(to right, #2563eb 0%, #2563eb ${audioVolume * 100}%, #4b5563 ${audioVolume * 100}%, #4b5563 100%)`
                }}
              />
            </div>
          </div>
        </div>
      )}

      {showAudioControls && (
        <div 
          className="fixed inset-0 z-20" 
          onClick={() => setShowAudioControls(false)}
        ></div>
      )}
      <div className="flex flex-col justify-center items-center min-h-screen p-2 sm:p-4 pt-16 sm:pt-20 transition-all duration-300">
        {/* Maze */}
        <div className="relative mb-8 sm:mb-12 transition-all duration-300">
          <div 
            className="relative border-4 sm:border-8 shadow-2xl transition-all duration-300"
            style={{ 
              width: GRID_SIZE * cellSize, 
              height: GRID_SIZE * cellSize,
              borderColor: '#8B4513',
              background: '255, 228, 181)',
              maxWidth: '95vw',
              maxHeight: '70vh'
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {currentLevel && currentLevel.maze.map((row, y) =>
              row.map((cell, x) =>
                cell === 1 && !brokenWallsRef.current.some(bw => bw.x === x && bw.y === y) ? (
                  <div
                    key={`${x}-${y}`}
                    className="absolute"
                    style={{
                      left: x * cellSize,
                      top: y * cellSize,
                      width: cellSize,
                      height: cellSize,
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
                className="absolute flex items-center justify-center animate-bounce"
                style={{
                  left: target.x * cellSize,
                  top: target.y * cellSize,
                  width: cellSize,
                  height: cellSize
                }}
              >
                <img src="treasure chest1.png" alt="treasure" style={{width: '100%', height: '100%'}} />
              </div>
            ))}

            {powerAnimation && (
              <div
                className="absolute flex items-center justify-center z-50"
                style={{
                  left: powerAnimation.x * cellSize,
                  top: powerAnimation.y * cellSize,
                  width: cellSize * 2,
                  height: cellSize * 2,
                  marginLeft: -cellSize / 2,
                  marginTop: -cellSize / 2,
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
                  left: star.x * cellSize,
                  top: star.y * cellSize,
                  width: cellSize,
                  height: cellSize
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
                    left: soldier.x * cellSize,
                    top: soldier.y * cellSize,
                    width: cellSize,
                    height: cellSize,
                    opacity: soldier.confused ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: `${cellSize * 0.8}px`
                  }}
                >
                  💂🏻‍♂️
                </div>
              )
            ))}

            <div
              className={`absolute transition-all duration-100 animate-bounce ${activePower === 'sword' ? 'scale-125 animate-pulse' : ''}`}
              style={{
                left: ninja.x * cellSize,
                top: ninja.y * cellSize,
                width: cellSize,
                height: cellSize,
                opacity: isInvisible ? 0.3 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: `${cellSize * 0.8}px`
              }}
            >
              🥷🏻
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
                    onClick={() => { playClickSound(); returnToMenu(); }}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition-transform hover:scale-110 border-2 border-gray-500"
                  >
                    Menu
                  </button>
                  <button
                    onClick={() => { playClickSound(); resetGame(); }}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-transform hover:scale-110 border-2 border-blue-400"
                  >
                    Retry
                  </button>
                  {gameWon && currentLevel && currentLevel.id < levels.length && (
                    <button
                      onClick={() => { playClickSound(); startLevel(currentLevel.id + 1); }}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-transform hover:scale-110 border-2 border-green-400"
                    >
                      Next Level
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls Below Maze */}
        <div className="flex justify-between items-center gap-6 sm:gap-12 w-full -mx-2 sm:-mx-4 transition-all duration-300">
          {/* Power Buttons - Left Side */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 transition-all duration-300">
            <button
              onClick={() => { playClickSound(); usePower('ninjaStars'); }}
              disabled={powers.ninjaStars === 0}
              className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg transition-all transform ${
                powers.ninjaStars > 0 
                  ? 'bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 hover:scale-110 shadow-lg border-2 border-green-300 cursor-pointer active:scale-95' 
                  : 'bg-gray-800 border-2 border-gray-600 cursor-not-allowed opacity-50'
              } text-white font-bold touch-manipulation flex items-center justify-center`}
            >
              <Star className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            <button
              onClick={() => { playClickSound(); usePower('sword'); }}
              disabled={powers.sword === 0}
              className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg transition-all transform ${
                powers.sword > 0 
                  ? 'bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 hover:scale-110 shadow-lg border-2 border-green-300 cursor-pointer active:scale-95' 
                  : 'bg-gray-800 border-2 border-gray-600 cursor-not-allowed opacity-50'
              } text-white font-bold touch-manipulation flex items-center justify-center`}
            >
              <Swords className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            <button
              onClick={() => { playClickSound(); usePower('wallBreaker'); }}
              disabled={powers.wallBreaker === 0}
              className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg transition-all transform ${
                powers.wallBreaker > 0 
                  ? 'bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 hover:scale-110 shadow-lg border-2 border-green-300 cursor-pointer active:scale-95' 
                  : 'bg-gray-800 border-2 border-gray-600 cursor-not-allowed opacity-50'
              } text-white font-bold touch-manipulation flex items-center justify-center`}
            >
              <Hammer className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            <button
              onClick={() => { playClickSound(); usePower('smokeScreen'); }}
              disabled={powers.smokeScreen === 0}
              className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg transition-all transform ${
                powers.smokeScreen > 0 
                  ? 'bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 hover:scale-110 shadow-lg border-2 border-green-300 cursor-pointer active:scale-95' 
                  : 'bg-gray-800 border-2 border-gray-600 cursor-not-allowed opacity-50'
              } text-white font-bold touch-manipulation flex items-center justify-center`}
            >
              <Cloud className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            <button
              onClick={() => { playClickSound(); usePower('hidingCloth'); }}
              disabled={powers.hidingCloth === 0}
              className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg transition-all transform ${
                powers.hidingCloth > 0 
                  ? 'bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 hover:scale-110 shadow-lg border-2 border-green-300 cursor-pointer active:scale-95' 
                  : 'bg-gray-800 border-2 border-gray-600 cursor-not-allowed opacity-50'
              } text-white font-bold touch-manipulation flex items-center justify-center`}
            >
              <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Control Arrows - Right Side */}
          <div className="grid grid-cols-3 gap-1 sm:gap-2 transition-all duration-300">
            <div></div>
            <button
              onClick={() => { playClickSound(); moveNinja(0, -1); }}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 text-white rounded-lg transition-all transform hover:scale-110 shadow-lg border-2 border-green-300 active:scale-95 touch-manipulation flex items-center justify-center"
            >
              <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div></div>
            
            <button
              onClick={() => { playClickSound(); moveNinja(-1, 0); }}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 text-white rounded-lg transition-all transform hover:scale-110 shadow-lg border-2 border-green-300 active:scale-95 touch-manipulation flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            <button
              onClick={() => { playClickSound(); moveNinja(0, 1); }}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 text-white rounded-lg transition-all transform hover:scale-110 shadow-lg border-2 border-green-300 active:scale-95 touch-manipulation flex items-center justify-center"
            >
              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            <button
              onClick={() => { playClickSound(); moveNinja(1, 0); }}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 text-white rounded-lg transition-all transform hover:scale-110 shadow-lg border-2 border-green-300 active:scale-95 touch-manipulation flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

        </div>
      </div>
      </div>
    );
  };

  // Return wrapper with persistent audio element
  return (
    <>
      {getMainContent()}
      <audio 
        ref={bgMusicRef} 
        src="/bg.mp3"
        autoPlay
        loop 
        preload="auto"
        muted={false}
        onLoadedData={() => {
          console.log('🎵 Audio loaded successfully');
          if (audioEnabled && isAudioPlaying && bgMusicRef.current) {
            bgMusicRef.current.volume = audioVolume;
            bgMusicRef.current.play().catch(e => console.log('Play on load failed:', e));
          }
        }}
        onError={(e) => console.error('Audio load error:', e)}
        onPlay={() => console.log('✓ Audio is now playing')}
        onPause={() => console.log('⊘ Audio paused')}
      />
    </>
  );
};

export default NinjaMissionGame;