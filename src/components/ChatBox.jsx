import { useState } from "react";
import { sendMessage } from "../services/chatApi";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendMessage(input);
      setMessages(prev => [
        ...prev,
        { role: "ai", text: reply }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "❌ AI sedang error" }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-message ${msg.role}`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="chat-message ai">Mengetik...</div>}
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ketik pesan..."
        />
        <button onClick={handleSend}>Kirim</button>
      </div>
    </div>
  );
}
