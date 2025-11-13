import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, Calendar } from 'lucide-react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { data, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

// Define types for Todo and Filter
type Todo = {
  id: number;
  taskName: string;
  taskDescription: string;
  isComplete: boolean;
  createdAt: string;
};

type Filter = 'all' | 'active' | 'completed';

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [taskName, setTaskName] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [filter, setFilter] = useState<Filter>('all');
  const[ user, setUser ] = useState<any>(null);

  const navigate = useNavigate();
  const { enqueueSnackbar }  = useSnackbar();

  // Load todos from localStorage on mount
  

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = async (
  e?: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>
) => {
  e?.preventDefault();

  if (!taskName.trim()) {
    enqueueSnackbar("Task name is required", { variant: "warning" });
    return;
  }

  try {
    // Make sure user is loaded
    if (!user || !user._id) {
      enqueueSnackbar("User not found. Please log in again.", { variant: "error" });
      navigate("/login");
      return;
    }


    const res = await axios.post(
      "http://localhost:5000/api/tasks/addTask",
      {
        userId: user._id, // 👈 send user._id here
        taskName,
        taskDescription,
      }
    );

    enqueueSnackbar(res.data.message, { variant: "success" });

    // Update UI immediately
    const newTask = {
      id: Date.now(),
      name: taskName,
      description: taskDescription,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    

    // Reset form fields
    setTaskName("");
    setTaskDescription("");
  } catch (err: any) {
    enqueueSnackbar(err.response?.data?.message || err.message, { variant: "error" });
  }
};

useEffect(() => {
  async function getTaskData() {
    try {
      const res = await axios.get(`http://localhost/api/tasks/${user._id}`);
      enqueueSnackbar(res.data.message, {variant: "success"});
      setTodos([...res.data.userTask]);
    } catch(err:any) {
      enqueueSnackbar(err.message, {variant: "error"});
    }
  }
  getTaskData();
}, [])


  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.isComplete } : todo
      )
    );
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditName(todo.taskName);
    setEditDescription(todo.taskDescription);
  };

  const saveEdit = (id: number) => {
    if (editName.trim()) {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, name: editName, description: editDescription } : todo
        )
      );
      setEditingId(null);
      setEditName('');
      setEditDescription('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.isComplete;
    if (filter === 'completed') return todo.isComplete;
    return true;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.isComplete).length,
    active: todos.filter((t) => !t.isComplete).length,
  };

  

  useEffect(() => {
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const decoded: any = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        return navigate("/login");
      }

      const res = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (err: any) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  }

  fetchUser();
}, []);

useEffect(() => {
  async function fetchTodo() {
    if (!user?._id) return; // wait until user is fetched

    try {
      const res = await axios.get(`http://localhost:5000/api/tasks/${user._id}`);
      setTodos(res.data.userTask);
      enqueueSnackbar(res.data.message, { variant: "success" });
    } catch (err: any) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  }

  console.log(todos);

  fetchTodo();
}, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            TaskFlow
          </h1>
          <p className="text-gray-300 text-lg">Organize your life, one task at a time</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 text-center">
            <div className="text-3xl font-bold text-purple-400">{stats.total}</div>
            <div className="text-gray-400 text-sm">Total Tasks</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 text-center">
            <div className="text-3xl font-bold text-green-400">{stats.completed}</div>
            <div className="text-gray-400 text-sm">Completed</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 text-center">
            <div className="text-3xl font-bold text-yellow-400">{stats.active}</div>
            <div className="text-gray-400 text-sm">Active</div>
          </div>
        </div>

        {/* Add Todo Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 mb-6 shadow-xl">
          <div className="space-y-4">
            <input
              type="text"
              value={taskName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTaskName(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && addTodo()}
              placeholder="Task Name"
              className="w-full bg-slate-900/50 text-white rounded-lg px-4 py-3 border border-purple-500/30 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />

            <textarea
              value={taskDescription}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTaskDescription(e.target.value)}
              placeholder="Task Description (optional)"
              rows={3}
              className="w-full bg-slate-900/50 text-white rounded-lg px-4 py-3 border border-purple-500/30 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
            />

            <button
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 font-semibold cursor-pointer"
              onClick={addTodo}
              disabled={!user?._id}
            >
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === f
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No tasks found. Add one to get started!</p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-[1.01]"
              >
                {editingId === todo.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditName(e.target.value)}
                      className="w-full bg-slate-900/50 text-white rounded-lg px-3 py-2 border border-purple-500/30 focus:border-purple-500 focus:outline-none"
                      placeholder="Task Name"
                      autoFocus
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditDescription(e.target.value)}
                      className="w-full bg-slate-900/50 text-white rounded-lg px-3 py-2 border border-purple-500/30 focus:border-purple-500 focus:outline-none resize-none"
                      placeholder="Task Description"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(todo.id)}
                        className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleComplete(todo.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-1 ${
                        todo.isComplete
                          ? 'bg-green-500 border-green-500'
                          : 'border-purple-500 hover:border-purple-400'
                      }`}
                    >
                      {todo.isComplete && <Check className="w-4 h-4 text-white" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-lg font-semibold text-white mb-1 transition-all ${
                          todo.isComplete ? 'line-through text-gray-500' : ''
                        }`}
                      >
                        {todo.taskName}
                      </h3>
                      {todo.taskDescription && (
                        <p
                          className={`text-gray-400 text-sm mb-2 transition-all ${
                            todo.isComplete ? 'line-through text-gray-600' : ''
                          }`}
                        >
                          {todo.taskDescription}
                        </p>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(todo.createdAt).toLocaleDateString()} at{' '}
                        {new Date(todo.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => startEdit(todo)}
                        className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-500/10 rounded-lg transition-all"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400 text-sm pb-8">
          <p>Built with ❤️ using React</p>
        </div>
      </div>
    </div>
  );
}
