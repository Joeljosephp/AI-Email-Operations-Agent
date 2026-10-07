import { useEffect, useMemo, useState } from "react"
import "./App.css"
import {
  checkBackend,
  getActions,
  getCategories,
  getCurrentUser,
  getEmails,
  loginUser,
  updateAction,
} from "./api"

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...")
  const [user, setUser] = useState(null)
  const [emails, setEmails] = useState([])
  const [categories, setCategories] = useState([])
  const [actions, setActions] = useState([])

  const [selectedEmail, setSelectedEmail] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [search, setSearch] = useState("")

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [loading, setLoading] = useState(false)
  const [appLoading, setAppLoading] = useState(false)

  const token = localStorage.getItem("access_token")

  useEffect(() => {
    checkBackend()
      .then(() => setBackendStatus("Connected"))
      .catch(() => setBackendStatus("Disconnected"))

    if (token) {
      loadDashboard()
    }
  }, [])

  const loadDashboard = async () => {
    try {
      setAppLoading(true)

      const [currentUser, emailData, categoryData, actionData] =
        await Promise.all([
          getCurrentUser(),
          getEmails(),
          getCategories(),
          getActions(),
        ])

      setUser(currentUser)
      setEmails(emailData)
      setCategories(categoryData)
      setActions(actionData)
    } catch (error) {
      console.error("Failed to load dashboard:", error)

      if (error.response?.status === 401) {
        handleLogout()
      }
    } finally {
      setAppLoading(false)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    setLoginError("")
    setLoading(true)

    try {
      await loginUser(username, password)
      await loadDashboard()
    } catch (error) {
      setLoginError(
        error.response?.data?.detail ||
          "Login failed. Please check your username and password."
      )
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")

    setUser(null)
    setEmails([])
    setCategories([])
    setActions([])
    setSelectedEmail(null)
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find((item) => item.id === categoryId)
    return category?.name || "Uncategorized"
  }

  const filteredEmails = useMemo(() => {
    return emails.filter((email) => {
      const matchesCategory =
        selectedCategory === "all" ||
        String(email.category) === String(selectedCategory)

      const searchText = search.toLowerCase().trim()

      const matchesSearch =
        !searchText ||
        email.subject?.toLowerCase().includes(searchText) ||
        email.sender?.toLowerCase().includes(searchText) ||
        email.snippet?.toLowerCase().includes(searchText)

      return matchesCategory && matchesSearch
    })
  }, [emails, selectedCategory, search])

  const pendingActions = actions.filter(
    (action) => action.status !== "completed"
  )

  const handleCompleteAction = async (actionId) => {
    try {
      const updated = await updateAction(actionId, {
        status: "completed",
      })

      setActions((current) =>
        current.map((action) =>
          action.id === actionId ? updated : action
        )
      )
    } catch (error) {
      console.error("Failed to complete action:", error)
    }
  }

  const openEmail = (email) => {
    setSelectedEmail(email)
  }

  const closeEmail = () => {
    setSelectedEmail(null)
  }

  if (!user) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="brand">
            <div className="brand-icon">✉</div>
            <div>
              <h1>AI Mail</h1>
              <p>Email Operations Agent</p>
            </div>
          </div>

          <div className="backend-indicator">
            <span
              className={
                backendStatus === "Connected"
                  ? "status-dot connected"
                  : "status-dot"
              }
            />
            Django API: {backendStatus}
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your username"
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />

            {loginError && <div className="error-message">{loginError}</div>}

            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="login-footer">
            AI-powered email organization and operations
          </div>
        </div>
      </div>
    )
  }

  if (appLoading) {
    return (
      <div className="loading-page">
        <div className="spinner" />
        <p>Loading your mailbox...</p>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon small">✉</div>
          <div>
            <strong>AI Mail</strong>
            <span>Operations Agent</span>
          </div>
        </div>

        <div className="user-card">
          <div className="avatar">
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <strong>{user.username}</strong>
            <span>{user.email || "Email account"}</span>
          </div>
        </div>

        <nav className="category-nav">
          <button
            className={selectedCategory === "all" ? "nav-item active" : "nav-item"}
            onClick={() => {
              setSelectedCategory("all")
              setSelectedEmail(null)
            }}
          >
            <span>📥</span>
            <span>All Mail</span>
            <b>{emails.length}</b>
          </button>

          {categories.map((category) => {
            const count = emails.filter(
              (email) => email.category === category.id
            ).length

            return (
              <button
                key={category.id}
                className={
                  String(selectedCategory) === String(category.id)
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() => {
                  setSelectedCategory(category.id)
                  setSelectedEmail(null)
                }}
              >
                <span>🏷️</span>
                <span>{category.name}</span>
                <b>{count}</b>
              </button>
            )
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="connection">
            <span className="status-dot connected" />
            API {backendStatus}
          </div>

          <button className="logout-button" onClick={handleLogout}>
            ↪ Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        {!selectedEmail ? (
          <>
            <header className="topbar">
              <div>
                <p className="eyebrow">Inbox</p>
                <h1>Good to see you, {user.username}</h1>
                <p className="muted">
                  Your email operations at a glance.
                </p>
              </div>

              <input
                className="search-input"
                type="search"
                placeholder="Search emails..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </header>

            <section className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon blue">✉</span>
                <div>
                  <strong>{emails.length}</strong>
                  <span>Total emails</span>
                </div>
              </div>

              <div className="stat-card">
                <span className="stat-icon orange">⚡</span>
                <div>
                  <strong>{pendingActions.length}</strong>
                  <span>Pending actions</span>
                </div>
              </div>

              <div className="stat-card">
                <span className="stat-icon green">✓</span>
                <div>
                  <strong>
                    {emails.filter((email) => email.is_processed).length}
                  </strong>
                  <span>Processed</span>
                </div>
              </div>
            </section>

            {pendingActions.length > 0 && (
              <section className="actions-section">
                <div className="section-heading">
                  <div>
                    <h2>Action items</h2>
                    <p>Things that still need your attention.</p>
                  </div>
                </div>

                <div className="actions-list">
                  {pendingActions.map((action) => (
                    <div className="action-card" key={action.id}>
                      <div>
                        <strong>{action.description}</strong>
                        <span>
                          {action.deadline
                            ? `Due ${new Date(
                                action.deadline
                              ).toLocaleString()}`
                            : "No deadline"}
                        </span>
                      </div>

                      <button
                        className="complete-button"
                        onClick={() => handleCompleteAction(action.id)}
                      >
                        Complete
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="emails-section">
              <div className="section-heading">
                <div>
                  <h2>
                    {selectedCategory === "all"
                      ? "All Mail"
                      : getCategoryName(selectedCategory)}
                  </h2>
                  <p>
                    {filteredEmails.length}{" "}
                    {filteredEmails.length === 1 ? "email" : "emails"}
                  </p>
                </div>
              </div>

              {filteredEmails.length === 0 ? (
                <div className="empty-state">
                  <div>📭</div>
                  <h3>No emails found</h3>
                  <p>
                    {search
                      ? "Try a different search."
                      : "Your mailbox is empty."}
                  </p>
                </div>
              ) : (
                <div className="email-list">
                  {filteredEmails.map((email) => (
                    <article
                      className={`email-card ${
                        !email.is_processed ? "unread" : ""
                      }`}
                      key={email.id}
                      onClick={() => openEmail(email)}
                    >
                      <div className="email-card-top">
                        <div>
                          <strong>{email.sender}</strong>
                          <span>
                            {new Date(email.received_at).toLocaleString()}
                          </span>
                        </div>

                        <span className="priority">
                          {email.priority}
                        </span>
                      </div>

                      <h3>{email.subject || "(No subject)"}</h3>

                      <p>{email.snippet || email.body}</p>

                      <div className="email-card-bottom">
                        <span className="category-pill">
                          {getCategoryName(email.category)}
                        </span>

                        {!email.is_processed && (
                          <span className="unread-label">New</span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          <section className="email-detail-page">
            <button className="back-button" onClick={closeEmail}>
              ← Back to inbox
            </button>

            <article className="email-detail-card">
              <div className="detail-header">
                <div>
                  <span className="category-pill">
                    {getCategoryName(selectedEmail.category)}
                  </span>

                  <h1>{selectedEmail.subject || "(No subject)"}</h1>

                  <p className="sender">
                    From <strong>{selectedEmail.sender}</strong>
                  </p>
                </div>

                <span className="priority large">
                  {selectedEmail.priority}
                </span>
              </div>

              <div className="detail-date">
                {new Date(selectedEmail.received_at).toLocaleString()}
              </div>

              <div className="email-body">
                {selectedEmail.body || selectedEmail.snippet}
              </div>

              {actions.filter(
                (action) => action.email === selectedEmail.id
              ).length > 0 && (
                <div className="detail-actions">
                  <h2>Actions</h2>

                  {actions
                    .filter((action) => action.email === selectedEmail.id)
                    .map((action) => (
                      <div className="detail-action" key={action.id}>
                        <div>
                          <strong>{action.description}</strong>
                          <span>
                            {action.deadline
                              ? `Due ${new Date(
                                  action.deadline
                                ).toLocaleString()}`
                              : "No deadline"}
                          </span>
                        </div>

                        {action.status === "completed" ? (
                          <span className="completed-badge">Completed</span>
                        ) : (
                          <button
                            className="complete-button"
                            onClick={() => handleCompleteAction(action.id)}
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </article>
          </section>
        )}
      </main>
    </div>
  )
}

export default App