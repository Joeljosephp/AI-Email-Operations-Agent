import { useState } from "react"
import "./App.css"

const categories = [
  { name: "Inbox", icon: "📥" },
  { name: "Internships", icon: "💼" },
  { name: "Clubs", icon: "👥" },
  { name: "College", icon: "🎓" },
  { name: "Personal", icon: "👤" },
  { name: "Events", icon: "🎉" },
  { name: "Finance", icon: "💰" },
  { name: "Other", icon: "📁" },
]

const emails = [
  {
    id: 1,
    sender: "Google Careers",
    subject: "Your application update",
    preview: "Thank you for applying. We have an update regarding your application...",
    category: "Internships",
    time: "10:42 AM",
  },
  {
    id: 2,
    sender: "College Department",
    subject: "Important assignment deadline",
    preview: "Please remember that the assignment submission deadline is Friday...",
    category: "College",
    time: "9:15 AM",
  },
  {
    id: 3,
    sender: "Tech Club",
    subject: "Hackathon registration is open!",
    preview: "Registration for this year's hackathon has officially opened...",
    category: "Clubs",
    time: "Yesterday",
  },
  {
    id: 4,
    sender: "LinkedIn",
    subject: "New job recommendations",
    preview: "We found some opportunities that might be a good match for you...",
    category: "Internships",
    time: "Yesterday",
  },
  {
    id: 5,
    sender: "Event Team",
    subject: "Workshop this Saturday",
    preview: "Join us this Saturday for an exciting technical workshop...",
    category: "Events",
    time: "Monday",
  },
]

function App() {
  const [selectedCategory, setSelectedCategory] = useState("Inbox")

  const filteredEmails =
    selectedCategory === "Inbox"
      ? emails
      : emails.filter((email) => email.category === selectedCategory)

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>AI Mail</h1>

        <p className="subtitle">Email Operations Agent</p>

        <nav>
          {categories.map((category) => (
            <button
              key={category.name}
              className={selectedCategory === category.name ? "active" : ""}
              onClick={() => setSelectedCategory(category.name)}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <div>
            <h2>{selectedCategory}</h2>
            <p>{filteredEmails.length} emails</p>
          </div>

          <input
            type="text"
            placeholder="Search emails..."
            className="search"
          />
        </header>

        <section className="email-list">
          {filteredEmails.map((email) => (
            <article className="email-card" key={email.id}>
              <div className="email-top">
                <strong>{email.sender}</strong>
                <span>{email.time}</span>
              </div>

              <h3>{email.subject}</h3>

              <p>{email.preview}</p>

              <span className="category-tag">{email.category}</span>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}

export default App