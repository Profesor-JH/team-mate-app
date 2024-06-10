import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatMessage } from "./hooks/useConsumer";
import useWebSocket from "./hooks/useWebSocket";
import ResponseContent from "./ResponseContent"; // i have created this Response component because the former layout was not allowing the response message to display with the format i wanted as per my prompt
import logo from "../src/logo.png"; // i was not able to import the logo from the public folder directly so i have added it here in the src
import FileUpload from './FileUpload';

function App() {
  const { sessionId, chatHistory, sendTextMessage } = useWebSocket();
  const [currentMessage, setCurrentMessage] = useState<string>("");

  const handleSendMessage = () => {
    const id = uuidv4();
    sendTextMessage(id, currentMessage);
    setCurrentMessage("");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <img src={logo} alt="TeamMate Logo" className="mb-5 w-32 h-32" /> {/* Then i was able to call it here */}
      <h1 className="mb-5 text-2xl font-bold">TeamMate</h1>
      <FileUpload sessionId={sessionId} /> {/* Including the FileUpload component */}
      <ChatWindow chatHistory={chatHistory} />
      <MessageInput
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
}

export default App;

interface ChatWindowProps {
  chatHistory: ChatMessage[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatHistory }) => {
  return (
    <div className="w-4/5 max-w-3xl h-96 overflow-y-auto bg-white border border-gray-300 rounded-lg p-4 mb-4">
      {chatHistory.map((message) => (
        <div
          key={message.id}
          className={`mb-4 p-3 rounded-lg ${
            message.isUserMessage ? "bg-green-100 self-end" : "bg-red-100 self-start"
          }`}
        >
          <ResponseContent content={message.message} />
        </div>
      ))}
    </div>
  );
};

interface MessageInputProps {
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  handleSendMessage: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  currentMessage,
  setCurrentMessage,
  handleSendMessage,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex w-4/5 max-w-3xl">
      <input
        type="text"
        value={currentMessage}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder="Type your message here..."
        className="flex-1 p-2 border border-gray-300 rounded-l-lg"
      />
      <button
        onClick={handleSendMessage}
        className="p-2 border border-gray-300 border-l-0 rounded-r-lg bg-blue-500 text-white hover:bg-blue-600"
      >
        Send
      </button>
    </div>
  );
};
