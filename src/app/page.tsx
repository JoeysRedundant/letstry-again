'use client';
import { Analytics } from "@vercel/analytics/react"
import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Clock, X } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  timer?: {
    duration: number; // in minutes
    startTime: Date;
    isActive: boolean;
  };
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [pendingTodo, setPendingTodo] = useState('');
  const [timerMinutes, setTimerMinutes] = useState(30);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
              const parsedTodos = JSON.parse(savedTodos).map((todo: { id: string; text: string; completed: boolean; createdAt: string; timer?: { duration: number; startTime: string; isActive: boolean } }) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        timer: todo.timer ? {
          ...todo.timer,
          startTime: new Date(todo.timer.startTime)
        } : undefined
      }));
      setTodos(parsedTodos);
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Timer countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTodos(prevTodos =>
        prevTodos.map(todo => {
          if (todo.timer && todo.timer.isActive && !todo.completed) {
            const now = new Date();
            const elapsed = Math.floor((now.getTime() - todo.timer.startTime.getTime()) / 1000);
            const remaining = (todo.timer.duration * 60) - elapsed;

            if (remaining <= 0) {
              // Timer finished
              return { ...todo, timer: { ...todo.timer, isActive: false } };
            }
          }
          return todo;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setPendingTodo(newTodo.trim());
      setShowTimerModal(true);
    }
  };

  const confirmAddTodo = () => {
    const totalSeconds = (timerMinutes * 60) + timerSeconds;
    const todo: Todo = {
      id: Date.now().toString(),
      text: pendingTodo,
      completed: false,
      createdAt: new Date(),
      timer: {
        duration: totalSeconds / 60,
        startTime: new Date(),
        isActive: true
      }
    };
    setTodos([...todos, todo]);
    setNewTodo('');
    setPendingTodo('');
    setShowTimerModal(false);
    setTimerMinutes(30);
    setTimerSeconds(0);
  };

  const cancelAddTodo = () => {
    setShowTimerModal(false);
    setPendingTodo('');
    setTimerMinutes(30);
    setTimerSeconds(0);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const getRemainingTime = (todo: Todo) => {
    if (!todo.timer || !todo.timer.isActive || todo.completed) return null;

    const now = new Date();
    const elapsed = Math.floor((now.getTime() - todo.timer.startTime.getTime()) / 1000);
    const remaining = (todo.timer.duration * 60) - elapsed;

    if (remaining <= 0) return null;

    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return { minutes, seconds };
  };

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
            Todo List
          </h1>

          {/* Add Todo Form */}
          <form onSubmit={addTodo} className="mb-8">
            <div className="flex gap-3">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                Add
              </button>
            </div>
          </form>

          {/* Filter Tabs */}
          <div className="flex justify-center mb-6">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { key: 'all', label: 'All', count: todos.length },
                { key: 'active', label: 'Active', count: activeCount },
                { key: 'completed', label: 'Completed', count: completedCount }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as 'all' | 'active' | 'completed')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === key
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>
          </div>

          {/* Todo List */}
          <div className="space-y-3 mb-6">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {filter === 'all' ? 'No todos yet. Add one above!' : `No ${filter} todos.`}
              </div>
            ) : (
              filteredTodos.map(todo => {
                const remainingTime = getRemainingTime(todo);
                return (
                  <div
                    key={todo.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                      todo.completed
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-white border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        todo.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-green-500'
                      }`}
                    >
                      {todo.completed && <Check size={14} />}
                    </button>

                    <div className="flex-1">
                      <span
                        className={`text-left block ${
                          todo.completed
                            ? 'line-through text-gray-500'
                            : 'text-gray-800'
                        }`}
                      >
                        {todo.text}
                      </span>
                      {todo.timer && remainingTime && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-orange-600">
                          <Clock size={12} />
                          <span className="font-mono">
                            {formatTime(remainingTime.minutes, remainingTime.seconds)}
                          </span>
                        </div>
                      )}
                                             {todo.timer && !remainingTime && !todo.completed && (
                         <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                           <Clock size={12} />
                           <span>Time&apos;s up!</span>
                         </div>
                       )}
                    </div>

                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Clear Completed Button */}
          {completedCount > 0 && (
            <div className="text-center">
              <button
                onClick={clearCompleted}
                className="px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
              >
                Clear completed ({completedCount})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Timer Modal */}
      {showTimerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Set Timer</h3>
              <button
                onClick={cancelAddTodo}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-600 mb-4">&quot;{pendingTodo}&quot;</p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How long should this task take?
              </label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Minutes</label>
                  <input
                    type="number"
                    min="0"
                    max="999"
                    value={timerMinutes}
                    onChange={(e) => setTimerMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Seconds</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={timerSeconds}
                    onChange={(e) => setTimerSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelAddTodo}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAddTodo}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
