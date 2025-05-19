import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  user: {
    name: string;
  };
}

interface JwtPayload {
  sub: number;
  role: string;
}

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    completed: false,
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const user = token ? jwtDecode<JwtPayload>(token) : null;

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchTasks() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3001/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Erro ao buscar tasks");

        const data: Task[] = await res.json();
        setTasks(data);
      } catch (err: any) {
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [token, router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setFormData({ title: "", description: "", completed: false });
    setShowModal(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      completed: task.completed,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const method = editingTask ? "PUT" : "POST";
      const url = editingTask
        ? `http://localhost:3001/tasks/${editingTask.id}`
        : `http://localhost:3001/tasks`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Erro ao salvar task");

      const savedTask = await res.json();

      if (editingTask) {
        toast.info("Task editada com sucesso!");
        setTasks((prev) =>
          prev.map((t) => (t.id === savedTask.id ? savedTask : t))
        );
      } else {
        toast.success("Task criada com sucesso!");
        setTasks((prev) => [...prev, savedTask]);
      }

      setShowModal(false);
    } catch (err: any) {
      throw new Error("Erro ao criar!");
    }
  };

  const tasksInProgress = tasks.filter((t) => !t.completed);
  const tasksCompleted = tasks.filter((t) => t.completed);

  if (loading) return <p>Carregando tarefas...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
        <div style={styles.container}>
          <header style={styles.header}>
            <h1 style={styles.title}>
              Tasks {user?.role === "admin" ? "(Admin)" : ""}
            </h1>
            <div>
              <button onClick={openCreateModal} style={styles.primaryButton}>
                + Nova Task
              </button>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Sair
              </button>
            </div>
          </header>

          <div style={styles.board}>
            <div style={styles.column}>
              <h2 style={styles.columnTitle}>📝 Em andamento</h2>
              {tasksInProgress.length === 0 && (
                <p>Nenhuma task em andamento.</p>
              )}
              {tasksInProgress.map((task) => (
                <div key={task.id} style={styles.card}>
                  <div>
                    <strong>{task.title}</strong>
                    <p style={styles.description}>{task.description}</p>
                    <small>Autor: {task.user.name}</small>
                  </div>
                  <button
                    onClick={() => openEditModal(task)}
                    style={styles.editButton}
                  >
                    Editar
                  </button>
                </div>
              ))}
            </div>

            <div style={styles.column}>
              <h2 style={styles.columnTitle}>✅ Concluídas</h2>
              {tasksCompleted.length === 0 && <p>Nenhuma task concluída.</p>}
              {tasksCompleted.map((task) => (
                <div key={task.id} style={{ ...styles.card, opacity: 0.6 }}>
                  <div>
                    <strong>{task.title}</strong>
                    <p style={styles.description}>{task.description}</p>
                    <small>Autor: {task.user.name}</small>
                  </div>
                  <button
                    onClick={() => openEditModal(task)}
                    style={styles.editButton}
                  >
                    Editar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {showModal && (
            <div style={styles.modalOverlay}>
              <div style={styles.modal}>
                <h2>{editingTask ? "Editar Task" : "Criar Task"}</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                  <input
                    type="text"
                    placeholder="Título"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    style={styles.input}
                  />
                  <textarea
                    placeholder="Descrição"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    style={{ ...styles.input, height: 80 }}
                  />
                  <label
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.completed}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          completed: e.target.checked,
                        })
                      }
                    />
                    Concluída
                  </label>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button type="submit" style={styles.primaryButton}>
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      style={styles.cancelButton}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f5f7",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2rem",
    margin: 0,
  },
  primaryButton: {
    backgroundColor: "#0052cc",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: 4,
    cursor: "pointer",
    marginRight: 8,
  },
  logoutButton: {
    backgroundColor: "#eb5a46",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: 4,
    cursor: "pointer",
  },
  board: {
    display: "flex",
    gap: "2rem",
  },
  column: {
    backgroundColor: "#e2e4e6",
    padding: "1rem",
    borderRadius: 8,
    flex: 1,
    minHeight: 400,
  },
  columnTitle: {
    marginTop: 0,
    fontSize: "1.25rem",
    borderBottom: "2px solid #ccc",
    paddingBottom: 4,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    padding: "1rem",
    borderRadius: 6,
    marginBottom: "1rem",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    gap: 8,
  },
  editButton: {
    backgroundColor: "#f0ad4e",
    border: "none",
    color: "white",
    padding: "0.3rem 0.75rem",
    borderRadius: 4,
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  description: {
    margin: "0.5rem 0",
    fontSize: "0.9rem",
    color: "#333",
  },
  modalOverlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: 8,
    width: "100%",
    maxWidth: 500,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    color: "#000",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: 4,
    cursor: "pointer",
  },
};
