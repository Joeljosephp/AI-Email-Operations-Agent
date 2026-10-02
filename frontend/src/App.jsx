import { useEffect, useState } from "react"
import "./App.css"
import { checkBackend } from "./api"

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...")

  useEffect(() => {
    checkBackend()
      .then(() => setBackendStatus("Connected"))
      .catch(() => setBackendStatus("Disconnected"))
  }, [])

  return (
    <div className="app">
      <main className="main-content">
        <h1>AI Mail</h1>

        <p>Email Operations Agent</p>

        <div className="action-panel">
          <h3>Backend Status</h3>

          <p>
            Django API: <strong>{backendStatus}</strong>
          </p>
        </div>
      </main>
    </div>
  )
}

export default App