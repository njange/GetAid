import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function App() {
  const [status, setStatus] = useState("checking...");

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setStatus(`${data.status} (db: ${data.db})`))
      .catch((err) => setStatus(`error: ${err.message}`));
  }, []);

  return (
    <section id="center">
      <h1>First Aid</h1>
      <p>API status: {status}</p>
    </section>
  );
}

export default App;
