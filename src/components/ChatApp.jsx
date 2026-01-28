import { useState, useRef, useEffect } from "react";
import "./chat.css";

export default function App() {
  const models = [
    "gpt-oss:120b-cloud",
    "gemini-3-flash-preview:cloud",
    "deepseek-v3.1:671b-cloud",
  ];

  const [model, setModel] = useState(models[0]);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setText("");

    try {
      const res = await fetch(
        "https://server-ai-eight.vercel.app/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            
          },
          body: JSON.stringify({
            model: model,
            text: text
          })
        }
      );

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ " + err.message }
      ]);
    }
  };


  return (
    <div className="chat-app">
      <header className="chat-header">
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          {models.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </header>

      <div className="chat-body">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`bubble ${msg.role === "user" ? "user" : "assistant"}`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ketik pesan..."
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button onClick={send}>➤</button>
      </div>
    </div>
  );
}
