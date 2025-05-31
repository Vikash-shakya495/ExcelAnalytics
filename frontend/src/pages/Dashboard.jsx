import { useEffect, useState } from "react";
import axios from "../services/api";

export default function Dashboard() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get("/upload/history").then(res => setHistory(res.data));
  }, []);

  return (
    <div>
      <h2>Upload History</h2>
      <ul>
        {history.map((item, index) => (
          <li key={index}>{item.fileName} → {item.chartType}</li>
        ))}
      </ul>
    </div>
  );
}
