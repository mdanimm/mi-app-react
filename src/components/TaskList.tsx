import { useCallback, useEffect, useState } from 'react';
import { createTask, deleteTask, getAllTasks, updateTask, type PaginatedTasks } from '../api/tasks.api';

const PAGE_SIZE = 10;

export function TaskList() {
  const [page, setPage] = useState(1);
  const [taskPage, setTaskPage] = useState<PaginatedTasks | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllTasks(page, PAGE_SIZE);
      setTaskPage(result);
      setError('');
    } catch {
      setError('No se pudo conectar con el backend.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;

    try {
      await createTask({
        title: newTitle.trim(),
        status: 'pending',
        priority: 'medium',
      });

      setNewTitle('');
      await loadTasks();
    } catch {
      setError('No se pudo crear la tarea. Inténtalo nuevamente.');
    }
  };

  const handleStatus = async (id: number, status: string) => {
    await updateTask(id, { status });
    await loadTasks();
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);

    const remainingTotal = Math.max(0, (taskPage?.total ?? 1) - 1);
    const remainingPages = Math.ceil(remainingTotal / PAGE_SIZE);

    if (page > remainingPages && remainingPages > 0) {
      setPage(remainingPages);
      return;
    }

    await loadTasks();
  };

  if (loading) return <p>Cargando tareas...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const tasks = taskPage?.data ?? [];
  const currentPage = taskPage?.page ?? page;
  const totalPages = taskPage?.totalPages ?? 0;

  return (
    <div>
      <h2>Tareas</h2>

      <input
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="Nueva tarea..."
      />

      <button onClick={handleCreate}>Agregar</button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong> — {task.status}

            <button
              onClick={() => handleStatus(task.id, 'in_progress')}
            >
              ▶
            </button>

            <button onClick={() => handleStatus(task.id, 'done')}>
              ✓
            </button>

            <button onClick={() => handleDelete(task.id)}>
              ✕
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={() => setPage(currentPage - 1)}
        disabled={loading || currentPage <= 1}
      >
        Anterior
      </button>

      <span>
        {' '}Página {currentPage} de {totalPages}{' '}
      </span>

      <button
        onClick={() => setPage(currentPage + 1)}
        disabled={loading || currentPage >= totalPages}
      >
        Siguiente
      </button>
    </div>
  );
}