
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

// Определение типов для персонажа
type Character = {
  id: string;
  x: number;
  y: number;
  color: string;
  name: string;
  direction: "left" | "right";
  isMoving: boolean;
  speed: number;
  sprite: number;
};

// Основные цвета для персонажей
const COLORS = [
  "#FF9AA2", // Розовый
  "#FFDAC1", // Персиковый
  "#B5EAD7", // Мятный
  "#C7CEEA", // Голубой
  "#F1E8B8", // Желтый
  "#E2F0CB", // Светло-зеленый
  "#A2D2FF", // Голубой
  "#FFC6FF", // Пурпурный
];

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [player, setPlayer] = useState<Character>({
    id: "player",
    x: 400,
    y: 300,
    color: COLORS[0],
    name: "Пони",
    direction: "right",
    isMoving: false,
    speed: 3,
    sprite: 0,
  });
  
  const [npcs, setNpcs] = useState<Character[]>([]);
  const [showCustomization, setShowCustomization] = useState(true);
  const [playerName, setPlayerName] = useState("Пони");
  const [playerColor, setPlayerColor] = useState(COLORS[0]);
  
  // Создание случайных NPC
  useEffect(() => {
    const newNpcs: Character[] = [];
    for (let i = 0; i < 5; i++) {
      newNpcs.push({
        id: `npc-${i}`,
        x: Math.random() * 800,
        y: Math.random() * 600,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        name: `NPC ${i + 1}`,
        direction: Math.random() > 0.5 ? "left" : "right",
        isMoving: Math.random() > 0.7,
        speed: 1 + Math.random() * 2,
        sprite: 0,
      });
    }
    setNpcs(newNpcs);
  }, []);

  // Обработка движения игрока
  useEffect(() => {
    const keys: Record<string, boolean> = {};
    
    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true;
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key] = false;
    };
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    const gameLoop = setInterval(() => {
      setPlayer(prev => {
        const newPlayer = { ...prev };
        let isMoving = false;
        
        if (keys["ArrowUp"] || keys["w"]) {
          newPlayer.y = Math.max(50, prev.y - prev.speed);
          isMoving = true;
        }
        if (keys["ArrowDown"] || keys["s"]) {
          newPlayer.y = Math.min(550, prev.y + prev.speed);
          isMoving = true;
        }
        if (keys["ArrowLeft"] || keys["a"]) {
          newPlayer.x = Math.max(20, prev.x - prev.speed);
          newPlayer.direction = "left";
          isMoving = true;
        }
        if (keys["ArrowRight"] || keys["d"]) {
          newPlayer.x = Math.min(780, prev.x + prev.speed);
          newPlayer.direction = "right";
          isMoving = true;
        }
        
        newPlayer.isMoving = isMoving;
        
        // Анимация спрайта
        if (isMoving && Date.now() % 10 === 0) {
          newPlayer.sprite = (newPlayer.sprite + 1) % 4;
        }
        
        return newPlayer;
      });
      
      // Обновление NPC
      setNpcs(prev => {
        return prev.map(npc => {
          if (!npc.isMoving && Math.random() < 0.01) {
            return { ...npc, isMoving: true, direction: Math.random() > 0.5 ? "left" : "right" };
          }
          if (npc.isMoving && Math.random() < 0.02) {
            return { ...npc, isMoving: false };
          }
          
          if (npc.isMoving) {
            let newX = npc.x;
            if (npc.direction === "left") {
              newX = Math.max(20, npc.x - npc.speed);
            } else {
              newX = Math.min(780, npc.x + npc.speed);
            }
            
            // Анимация спрайта
            const newSprite = (npc.sprite + (Date.now() % 5 === 0 ? 1 : 0)) % 4;
            
            return { 
              ...npc, 
              x: newX, 
              sprite: newSprite,
              direction: Math.random() < 0.01 ? (npc.direction === "left" ? "right" : "left") : npc.direction
            };
          }
          
          return npc;
        });
      });
    }, 1000 / 60); // 60 FPS
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearInterval(gameLoop);
    };
  }, []);
  
  // Отрисовка игры
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Очистка холста
    ctx.clearRect(0, 0, 800, 600);
    
    // Отрисовка фона
    ctx.fillStyle = "#8debb3"; // Зеленая трава
    ctx.fillRect(0, 0, 800, 600);
    
    // Рисуем траву и декорации
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = "#7bc99a";
      ctx.fillRect(
        Math.sin(i * 324) * 800, 
        Math.cos(i * 142) * 600, 
        10 + Math.random() * 30, 
        10 + Math.random() * 30
      );
    }
    
    // Отрисовка персонажей
    const drawCharacter = (character: Character) => {
      // Тело пони
      ctx.fillStyle = character.color;
      ctx.beginPath();
      ctx.ellipse(
        character.x, 
        character.y, 
        25, // ширина
        15, // высота
        0, 
        0, 
        Math.PI * 2
      );
      ctx.fill();
      
      // Голова
      ctx.beginPath();
      ctx.ellipse(
        character.x + (character.direction === "right" ? 15 : -15), 
        character.y - 5, 
        12, // ширина
        12, // высота
        0, 
        0, 
        Math.PI * 2
      );
      ctx.fill();
      
      // Глаза
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.ellipse(
        character.x + (character.direction === "right" ? 18 : -18), 
        character.y - 7, 
        4, 
        4, 
        0, 
        0, 
        Math.PI * 2
      );
      ctx.fill();
      
      // Зрачок
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.ellipse(
        character.x + (character.direction === "right" ? 19 : -19), 
        character.y - 7, 
        2, 
        2, 
        0, 
        0, 
        Math.PI * 2
      );
      ctx.fill();
      
      // Хвост
      ctx.fillStyle = character.color;
      ctx.beginPath();
      ctx.moveTo(
        character.x + (character.direction === "right" ? -20 : 20), 
        character.y
      );
      ctx.quadraticCurveTo(
        character.x + (character.direction === "right" ? -30 : 30), 
        character.y - 15,
        character.x + (character.direction === "right" ? -40 : 40), 
        character.y
      );
      ctx.quadraticCurveTo(
        character.x + (character.direction === "right" ? -30 : 30), 
        character.y + 5,
        character.x + (character.direction === "right" ? -20 : 20), 
        character.y
      );
      ctx.fill();
      
      // Ноги (с анимацией)
      const legOffset = character.isMoving ? 
        [Math.sin(character.sprite * Math.PI/2) * 5, Math.cos(character.sprite * Math.PI/2) * 5, 
         Math.cos(character.sprite * Math.PI/2) * 5, Math.sin(character.sprite * Math.PI/2) * 5] : 
        [0, 0, 0, 0];
      
      ctx.fillStyle = character.color;
      
      // Передняя нога 1
      ctx.fillRect(
        character.x + (character.direction === "right" ? 10 : -15), 
        character.y + 10, 
        5, 
        10 + legOffset[0]
      );
      
      // Передняя нога 2
      ctx.fillRect(
        character.x + (character.direction === "right" ? 15 : -20), 
        character.y + 10, 
        5, 
        10 + legOffset[1]
      );
      
      // Задняя нога 1
      ctx.fillRect(
        character.x + (character.direction === "right" ? -15 : 10), 
        character.y + 10, 
        5, 
        10 + legOffset[2]
      );
      
      // Задняя нога 2
      ctx.fillRect(
        character.x + (character.direction === "right" ? -10 : 5), 
        character.y + 10, 
        5, 
        10 + legOffset[3]
      );
      
      // Имя персонажа
      ctx.fillStyle = "#000000";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(character.name, character.x, character.y - 25);
    };
    
    // Отрисовка NPC
    npcs.forEach(drawCharacter);
    
    // Отрисовка игрока
    drawCharacter(player);
    
  }, [player, npcs]);
  
  // Начало игры
  const startGame = () => {
    setPlayer(prev => ({
      ...prev,
      name: playerName,
      color: playerColor
    }));
    setShowCustomization(false);
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-pink-100 p-4">
      {showCustomization ? (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-6 text-purple-600">Мир Пони</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Имя вашей пони</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Введите имя"
                maxLength={15}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Цвет</label>
              <div className="flex flex-wrap gap-2 justify-center">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setPlayerColor(color)}
                    className={`w-8 h-8 rounded-full transition-all ${playerColor === color ? 'ring-2 ring-purple-500 scale-110' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            <Button 
              onClick={startGame}
              className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
            >
              Начать игру
            </Button>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Используйте WASD или стрелки для движения</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <canvas 
            ref={canvasRef} 
            width={800} 
            height={600} 
            className="border-4 border-purple-300 rounded-lg shadow-xl bg-green-200"
          />
          
          <div className="absolute top-4 right-4">
            <Button 
              onClick={() => setShowCustomization(true)}
              size="sm"
              variant="outline"
              className="bg-white/80 hover:bg-white"
            >
              Настройки
            </Button>
          </div>
          
          <div className="mt-4 bg-white/80 p-3 rounded-lg shadow-md">
            <p className="text-center">Используйте WASD или стрелки для движения</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
