
import React, { useState } from "react";
import "../styles/ChatInput.css";


export default function ChatInput({ onSubmit }) {
  /** Current input displayed in the input bar */
  const [input, setInput] = useState("");

  /** Handle message submission */
  function handleSubmit() {
    if (input.trim() !== "") {
      const newMessage = {
        id: crypto.randomUUID(),
        sender: "Client",
        text: input,
      };

      onSubmit(newMessage); // Pass new message to parent
      setInput(""); // Clear input bar
    }
  }

  /** Update input bar display */
  function handleChange(event) {
    setInput(event.target.value);
  }

  /** Check for submission event in input bar */
  function handleKeyDown(event) {
    // Allow the user to use shift+enter to insert line break
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent refresh
      handleSubmit();
    }
  }

  return (
    <div className="container-input">
      <input
        className="text-area"
        type="text"
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button className="button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
