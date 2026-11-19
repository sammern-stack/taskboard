import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState();

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((d) => setData(d));
  }, []);

  return (
    <div>
      <h1>My App</h1>
      <p>API status: {JSON.stringify(data, null, 2)}</p>
    </div>
  );
}

export default App;
