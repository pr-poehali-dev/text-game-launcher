import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [gameOutput, setGameOutput] = useState<string[]>([
    '> Система запущена...',
    '> Инициализация игрового терминала...',
    '> Готов к приему команд',
    '',
    '╔══════════════════════════════════════════════════════════════╗',
    '║                     ИГРОВОЙ ТЕРМИНАЛ                         ║',
    '║                        v1.0.0                                ║',
    '╚══════════════════════════════════════════════════════════════╝',
    '',
    '> Введите команду или код игры для начала...'
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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

  const handleCommand = (command: string) => {
    if (!command.trim()) return;

    setIsTyping(true);
    
    // Добавляем команду пользователя
    const newOutput = [...gameOutput, `$ ${command}`];
    
    // Обработка команд
    if (command.toLowerCase() === 'clear') {
      setGameOutput([
        '> Терминал очищен',
        '> Готов к приему команд'
      ]);
    } else if (command.toLowerCase() === 'help') {
      newOutput.push(
        '',
        '═══════════════ ДОСТУПНЫЕ КОМАНДЫ ═══════════════',
        '  clear     - очистить терминал',
        '  help      - показать справку',
        '  start     - начать новую игру',
        '  status    - статус системы',
        '  exit      - выход из программы',
        '',
        '> Вставьте код игры для интеграции...'
      );
      setGameOutput(newOutput);
    } else if (command.toLowerCase() === 'status') {
      newOutput.push(
        '',
        '══════════════ СТАТУС СИСТЕМЫ ══════════════',
        '  CPU: ████████████████████ 100%',
        '  RAM: ██████████████░░░░░░ 70%',
        '  Игра: НЕ ЗАГРУЖЕНА',
        '  Статус: ОЖИДАНИЕ КОДА ИГРЫ',
        ''
      );
      setGameOutput(newOutput);
    } else if (command.toLowerCase() === 'start') {
      newOutput.push(
        '',
        '> Ошибка: игра не загружена',
        '> Пожалуйста, вставьте код игры в терминал',
        ''
      );
      setGameOutput(newOutput);
    } else if (command.toLowerCase() === 'exit') {
      newOutput.push(
        '',
        '> Завершение работы...',
        '> До свидания! 👾',
        ''
      );
      setGameOutput(newOutput);
    } else {
      // Проверяем, похоже ли на код
      if (command.includes('function') || command.includes('class') || command.includes('const') || command.includes('let') || command.includes('var')) {
        newOutput.push(
          '',
          '> Обнаружен код JavaScript...',
          '> Анализирую структуру...',
          '> Интегрирую в игровой движок...',
          '',
          '✓ Код успешно загружен!',
          '> Введите "start" для запуска игры',
          ''
        );
      } else {
        newOutput.push(
          '',
          `> Неизвестная команда: "${command}"`,
          '> Введите "help" для справки',
          ''
        );
      }
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
            <h1 className="text-lg font-bold">ИГРОВОЙ ТЕРМИНАЛ</h1>
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
            ) : line.includes('✓') ? (
              <span className="text-terminal-green font-bold">{line}</span>
            ) : line.includes('Ошибка') || line.includes('ошибка') ? (
              <span className="text-red-400">{line}</span>
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
            placeholder="Введите команду или вставьте код игры..."
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
          {['help', 'clear', 'status', 'start'].map((cmd) => (
            <Button
              key={cmd}
              variant="outline"
              size="sm"
              onClick={() => handleCommand(cmd)}
              className="border-terminal-gray text-terminal-green hover:bg-terminal-gray hover:text-terminal-green font-mono text-xs"
            >
              {cmd}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;