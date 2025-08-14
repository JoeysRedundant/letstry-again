'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, X } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }));
      setTodos(parsedTodos);
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date()
      };
      setTodos([...todos, todo]);
      setNewTodo('');
    }
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
                  onClick={() => setFilter(key as any)}
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
              filteredTodos.map(todo => (
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

                  <span
                    className={`flex-1 text-left ${
                      todo.completed
                        ? 'line-through text-gray-500'
                        : 'text-gray-800'
                    }`}
                  >
                    {todo.text}
                  </span>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
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
    </div>
  );
}
