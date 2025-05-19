import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';

export default function LoginPage() {
  const [showModal, setShowModal] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`http://localhost:3001/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      if (!res.ok) throw new Error("Dados incorretos!");
      const data = await res.json();

      localStorage.setItem("token", data.access_token);
      toast.success("Usuário logado com sucesso!")
      window.location.href = "/tasks";
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`http://localhost:3001/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      if (!res.ok) throw new Error("Erro ao cadastrar!");
      toast.success("Cadastrado com sucesso!")
      setShowModal(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Login</h1>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={loginData.email}
          onChange={(e) =>
            setLoginData({ ...loginData, email: e.target.value })
          }
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Senha"
          value={loginData.password}
          onChange={(e) =>
            setLoginData({ ...loginData, password: e.target.value })
          }
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Entrar
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        Não tem conta?{" "}
        <button onClick={() => setShowModal(true)} style={styles.link}>
          Cadastrar
        </button>
      </p>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Cadastro</h2>
            <form onSubmit={handleRegister} style={styles.form}>
              <input
                type="text"
                placeholder="Nome"
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({ ...registerData, name: e.target.value })
                }
                style={styles.input}
              />
              <input
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
                style={styles.input}
              />
              <input
                type="password"
                placeholder="Senha"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
                style={styles.input}
              />
              <select
                value={registerData.role}
                onChange={(e) =>
                  setRegisterData({ ...registerData, role: e.target.value })
                }
                style={styles.input}
              >
                <option value="user">Usuário</option>
                <option value="admin">Administrador</option>
              </select>
              <button type="submit" style={styles.button}>
                Cadastrar
              </button>
            </form>
            <button onClick={() => setShowModal(false)} style={styles.closeBtn}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "400px",
    margin: "80px auto",
    padding: "1rem",
    textAlign: "center",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  input: {
    padding: "0.5rem",
    fontSize: "1rem",
  },
  button: {
    padding: "0.75rem",
    fontWeight: "bold",
    cursor: "pointer",
    backgroundColor: "#0070f3",
    color: "white",
    border: "none",
    borderRadius: "4px",
  },
  link: {
    background: "none",
    color: "#0070f3",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
    padding: 0,
    fontSize: "1rem",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    minWidth: "300px",
  },
  closeBtn: {
    marginTop: "1rem",
    backgroundColor: "#ccc",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
