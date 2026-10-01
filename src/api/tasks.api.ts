const API_URL = 'http://localhost:3000/tasks';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const getAllTasks = async (): Promise<Task[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error al obtener las tareas');
  return res.json();
};

export const createTask = async (data: { title: string; description?: string }): Promise<Task> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear la tarea');
  return res.json();
};

export const updateTask = async (id: number, data: Partial<Task>): Promise<Task> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar la tarea');
  return res.json();
};

export const deleteTask = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar la tarea');
};