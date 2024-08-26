import { useState, useRef, useEffect } from "react";
import { ThreeDot } from "react-loading-indicators";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Radius } from "lucide-react";

const MessageInput = ({ onSubmit, disabled }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm Alex, Auto Choice's support assistant. How can I help you today?",
    },
  ]);

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return; // Don't send empty messages
    setIsLoading(true);

    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, { role: "user", content: message }]),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content:
            "I'm sorry, but I encountered an error. Please try again later.",
        },
      ]);
    }

    setIsLoading(false);
  };
  return (
    <div
      style={{
        height: "90vh",
        position: "relative",
        display: "flex",
        justifyContent: "center",
      }}
    >


{/*------------code to display the messages ----------------------*/}
<div className="flex-grow-1 overflow-auto p-3" style={{ maxHeight: "calc(100% - 100px)", width:"90%",}}>
        {messages.map((message, index) => (
          <div key={index} className={`d-flex ${message.role === "assistant" ? "justify-content-start" : "justify-content-end"} mb-3`}>
            <div className={`card ${message.role === "assistant" ? "bg-light" : "bg-primary text-white"}`} style={{ maxWidth: "75%" }}>
              <div className="card-body py-2 px-3">
                <p className="mb-0">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="d-flex justify-content-start mb-3">
            <div className="card bg-light" style={{ maxWidth: "75%" }}>
              <div className="card-body py-2 px-3">
                <ThreeDot color="#6c757d" size="small" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/*----------------code for the input chat box---------------*/}

      <form
        onSubmit={sendMessage}
        style={{ position: "absolute", bottom: "0px", width: "90%", border:"solid 1px black", borderRadius: "10px"}}
      >
        <Input
          type="text"
          value={message}
          style={{borderRadius: "10px"}}
          placeholder="Your message here"
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
      </form>
    </div>
  );
};
export default MessageInput;
