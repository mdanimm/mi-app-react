import { useEffect, useState } from 'react';
import { Task, getAllTasks, createTask, updateTask, deleteTask } from '../api/tasks.api';

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllTasks()
      .then(setTasks)
      .catch(() => setError('No se pudo conectar con el backend.'))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    const task = await createTask({ title: newTitle });
    setTasks((prev) => [...prev, task]);
    setNewTitle('');
  };

  const handleStatus = async (id: number, status: string) => {
    const updated = await updateTask(id, { status });
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  if (loading) return <p>Cargando tareas...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Tareas</h2>
      <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Nueva tarea..." />
      <button onClick={handleCreate}>Agregar</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong> — {task.status}
            <button onClick={() => handleStatus(task.id, 'in_progress')}>▶</button>
            <button onClick={() => handleStatus(task.id, 'done')}>✓</button>
            <button onClick={() => handleDelete(task.id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}