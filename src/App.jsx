import { TaskList } from './components/TaskList';

export default function App() {
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Gestor de Tareas — Fullstack</h1>
      <TaskList />
    </div>
  );
}