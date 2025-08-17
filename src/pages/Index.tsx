import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Task, GameState, LEVELS } from '@/types/game';
import { tasks } from '@/data/tasks';

const Index = () => {
  const [gameOutput, setGameOutput] = useState<string[]>([
    '> Система запущена...',
    '> Инициализация игрового терминала...',
    '> Готов к приему команд',
    '',
    '╔══════════════════════════════════════════════════════════════╗',
    '║                 ШКОЛЬНЫЙ СИСАДМИН — МОСКВА                   ║',
    '║                        v1.0.0                                ║',
    '╚══════════════════════════════════════════════════════════════╝',
    '',
    '> Введите "game" для начала игры или "help" для справки...'
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 0,
    currentTask: null,
    score: 0,
    isGameActive: false,
    showingHint: false
  });
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [gameOutput]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const getRandomTask = (level: number): Task => {
    const levelTasks = tasks.filter(t => t.level === level);
    return levelTasks[Math.floor(Math.random() * levelTasks.length)];
  };

  const startLevel = (level: number) => {
    const task = getRandomTask(level);
    setGameState({
      currentLevel: level,
      currentTask: task,
      score: 0,
      isGameActive: true,
      showingHint: false
    });
    
    const newOutput = [...gameOutput, 
      '',
      `═══════════════ УРОВЕНЬ: ${LEVELS[level as keyof typeof LEVELS]} ═══════════════`,
      '',
      `=== ${task.title} ===`,
      task.description,
      ''
    ];
    
    task.options.forEach((option, index) => {
      newOutput.push(`${index + 1}. ${option}`);
    });
    
    newOutput.push(
      '0. Показать подсказку',
      '',
      '> Введите номер варианта ответа...'
    );
    
    setGameOutput(newOutput);
  };

  const handleGameAnswer = (choice: number) => {
    if (!gameState.currentTask) return;
    
    const newOutput = [...gameOutput, `$ ${choice}`];
    
    if (choice === 0) {
      newOutput.push(
        '',
        `💡 Подсказка: ${gameState.currentTask.hint}`,
        ''
      );
      setGameState(prev => ({ ...prev, showingHint: true }));
    } else if (choice === gameState.currentTask.solution) {
      newOutput.push(
        '',
        '✅ Правильно! Задача решена.',
        `+${gameState.showingHint ? '5' : '10'} очков к репутации сисадмина!`,
        '',
        '> Введите "next" для следующей задачи или "menu" в главное меню'
      );
      setGameState(prev => ({ 
        ...prev, 
        score: prev.score + (prev.showingHint ? 5 : 10)
      }));
    } else {
      newOutput.push(
        '',
        '❌ Неверно, попробуйте снова.',
        '> Введите другой номер варианта или 0 для подсказки'
      );
    }
    
    setGameOutput(newOutput);
  };

  const handleCommand = (command: string) => {
    if (!command.trim()) return;

    setIsTyping(true);
    
    const cmd = command.toLowerCase();
    const newOutput = [...gameOutput, `$ ${command}`];
    
    // Если игра активна и введен номер
    if (gameState.isGameActive && /^\d+$/.test(cmd)) {
      handleGameAnswer(parseInt(cmd));
      setIsTyping(false);
      return;
    }
    
    // Обработка команд
    if (cmd === 'clear') {
      setGameOutput([
        '> Терминал очищен',
        '> Введите "game" для начала игры'
      ]);
    } else if (cmd === 'help') {
      newOutput.push(
        '',
        '═══════════════ ДОСТУПНЫЕ КОМАНДЫ ═══════════════',
        '  clear     - очистить терминал',
        '  help      - показать справку',
        '  game      - начать игру "Школьный Сисадмин"',
        '  status    - статус системы',
        '  score     - показать текущий счет',
        '  exit      - выход из программы',
        ''
      );
      setGameOutput(newOutput);
    } else if (cmd === 'game') {
      newOutput.push(
        '',
        '🎮 Добро пожаловать в игру: Школьный Сисадмин — Москва!',
        '',
        'Выберите уровень сложности:',
        '1. Новичок',
        '2. Опытный',
        '3. Профессионал',
        '',
        '> Введите номер уровня (1-3)...'
      );
      setGameOutput(newOutput);
      setGameState(prev => ({ ...prev, isGameActive: false }));
    } else if (['1', '2', '3'].includes(cmd) && !gameState.isGameActive) {
      startLevel(parseInt(cmd));
    } else if (cmd === 'next' && gameState.isGameActive) {
      if (gameState.currentTask) {
        const newTask = getRandomTask(gameState.currentLevel);
        setGameState(prev => ({ 
          ...prev, 
          currentTask: newTask,
          showingHint: false
        }));
        
        newOutput.push(
          '',
          `=== ${newTask.title} ===`,
          newTask.description,
          ''
        );
        
        newTask.options.forEach((option, index) => {
          newOutput.push(`${index + 1}. ${option}`);
        });
        
        newOutput.push(
          '0. Показать подсказку',
          ''
        );
        
        setGameOutput(newOutput);
      }
    } else if (cmd === 'menu') {
      setGameState({
        currentLevel: 0,
        currentTask: null,
        score: 0,
        isGameActive: false,
        showingHint: false
      });
      newOutput.push(
        '',
        '> Возврат в главное меню',
        '> Введите "game" для начала новой игры',
        ''
      );
      setGameOutput(newOutput);
    } else if (cmd === 'score') {
      newOutput.push(
        '',
        `═══════════════ СТАТИСТИКА ═══════════════`,
        `  Текущий счет: ${gameState.score} очков`,
        `  Уровень: ${gameState.currentLevel ? LEVELS[gameState.currentLevel as keyof typeof LEVELS] : 'Не выбран'}`,
        `  Статус: ${gameState.isGameActive ? 'В игре' : 'В меню'}`,
        ''
      );
      setGameOutput(newOutput);
    } else if (cmd === 'status') {
      newOutput.push(
        '',
        '══════════════ СТАТУС СИСТЕМЫ ══════════════',
        '  CPU: ████████████████████ 100%',
        '  RAM: ██████████████░░░░░░ 70%',
        '  Игра: ШКОЛЬНЫЙ СИСАДМИН ЗАГРУЖЕНА ✓',
        `  Статус: ${gameState.isGameActive ? 'АКТИВНА' : 'ОЖИДАНИЕ'}`,
        ''
      );
      setGameOutput(newOutput);
    } else if (cmd === 'exit') {
      newOutput.push(
        '',
        '> Завершение работы...',
        '> Спасибо за игру! 👨‍💻',
        ''
      );
      setGameOutput(newOutput);
    } else {
      newOutput.push(
        '',
        `> Неизвестная команда: "${command}"`,
        '> Введите "help" для справки',
        ''
      );
      setGameOutput(newOutput);
    }
    
    setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim()) {
      handleCommand(currentInput);
      setCurrentInput('');
    }
  };

  return (
    <div className="min-h-screen bg-terminal-black text-terminal-green font-mono">
      {/* Header */}
      <div className="border-b border-terminal-gray p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Icon name="Terminal" size={24} className="text-terminal-green" />
            <h1 className="text-lg font-bold">ШКОЛЬНЫЙ СИСАДМИН</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-terminal-green"></div>
          </div>
        </div>
      </div>

      {/* Terminal Output */}
      <div 
        ref={outputRef}
        className="h-[calc(100vh-180px)] overflow-y-auto p-6 space-y-1 text-sm leading-relaxed"
      >
        {gameOutput.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap">
            {line.startsWith('$') ? (
              <span className="text-terminal-grayLight">{line}</span>
            ) : line.includes('✓') || line.includes('✅') ? (
              <span className="text-terminal-green font-bold">{line}</span>
            ) : line.includes('Ошибка') || line.includes('ошибка') || line.includes('❌') ? (
              <span className="text-red-400">{line}</span>
            ) : line.includes('💡') ? (
              <span className="text-yellow-400">{line}</span>
            ) : (
              line
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center space-x-1">
            <span>></span>
            <span className="animate-blink">_</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-terminal-gray p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <span className="text-terminal-green">$</span>
          <Input
            ref={inputRef}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            className="flex-1 bg-terminal-black border-terminal-gray text-terminal-green font-mono placeholder-terminal-grayLight focus:border-terminal-green"
            placeholder="Введите команду..."
            autoComplete="off"
          />
          <Button 
            type="submit"
            className="bg-terminal-green text-terminal-black hover:bg-terminal-green/80 font-mono"
          >
            <Icon name="Send" size={16} />
          </Button>
        </form>
        
        {/* Quick Commands */}
        <div className="flex flex-wrap gap-2 mt-3">
          {gameState.isGameActive ? (
            ['0', '1', '2', '3', '4'].map((num) => (
              <Button
                key={num}
                variant="outline"
                size="sm"
                onClick={() => handleCommand(num)}
                className="border-terminal-gray text-terminal-green hover:bg-terminal-gray hover:text-terminal-green font-mono text-xs"
              >
                {num}
              </Button>
            ))
          ) : (
            ['help', 'game', 'clear', 'score'].map((cmd) => (
              <Button
                key={cmd}
                variant="outline"
                size="sm"
                onClick={() => handleCommand(cmd)}
                className="border-terminal-gray text-terminal-green hover:bg-terminal-gray hover:text-terminal-green font-mono text-xs"
              >
                {cmd}
              </Button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;