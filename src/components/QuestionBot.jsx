import { useState } from "react";

export default function QuestionBot({ knowledgeBase }) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleInput = (e) => {
    setInput(e.target.value);
    const q = e.target.value.toLowerCase();
    const match = Object.keys(knowledgeBase).find((k) =>
      k.toLowerCase().includes(q)
    );
    setResponse(match ? knowledgeBase[match] : "");
  };

  return (
    <div style={{ textAlign: "center", marginTop: 30 }}>
      <input
        value={input}
        onChange={handleInput}
        placeholder="Ask a question..."
        style={{ padding: 10, fontSize: 16, width: "300px" }}
      />
      <div style={{ marginTop: 15, fontSize: 18, color: "#333" }}>
        {response}
      </div>
    </div>
  );
}