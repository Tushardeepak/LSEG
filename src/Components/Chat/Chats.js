import React from "react";
import { ChatBotIcon } from "../../Assets/Expoter/chatBotIcon";
import "../Styles/styles.css";

const Chats = ({
  isUser = false,
  fromUser = "",
  heading = "",
  options = [],
  handleSelection,
  isActive,
  loader,
}) => {
  return (
    <div className="chatContainer">
      {isUser ? ( // Checking if the message is from user or bot
        <div className="userChatContainer">{fromUser}</div>
      ) : (
        <div
          className="autoChatContainer"
          style={{ opacity: isActive ? 1 : 0.7 }} // Reducing the opacity for older chats
        >
          <ChatBotIcon />
          {isActive && loader ? ( // This loader will only come for latest chat
            <p className="botThinkText">Thinking...</p>
          ) : (
            <div className="autoChatBox">
              <div className="autoChatHeader">{heading}</div>
              <div className="autoChatOptions">
                {options?.map((op) => (
                  <div
                    key={op}
                    className="options"
                    onClick={() => isActive && handleSelection(op)} // Disabling the selection option for older chats
                  >
                    {op}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chats;
