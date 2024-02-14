import React, { useRef, useEffect } from "react";

/**
 * Container to display message history in a scrollable window. 
 * @author: Luke Dewhurst
 * @param {{id: number, sender: string, text: string}[]} messages Array of messages to display
 * @returns React Component
 */
export default function ChatHistory({ messages }) {
  const windowEnd = useRef(null);

  /** Scroll to bottom on message submit */
  useEffect(() => {
    windowEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /** Calculate the width of the chat message container */
  function calcWidth(message) {
    return message.text.length * 10;
  }

  return (
    <div className="chat-history">
      {messages &&
        messages.map((message) => (
          <div
            className="chat-message"
            key={message.id}
            style={{ width: calcWidth(message) }}
          >
            <h3>{message.sender}</h3>
            <p>{message.text}</p>
          </div>
        ))}
      <div ref={windowEnd} />
    </div>
  );
}
