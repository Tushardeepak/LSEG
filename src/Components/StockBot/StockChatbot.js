import React, { useState, useRef, useEffect } from "react";
import { ChatBotIcon } from "../../Assets/Expoter/chatBotIcon";
import {
  FINAL_STAGE,
  GO_BACK,
  localData,
  mainMenuAndGoBack,
  MAIN_MENU,
} from "../../Utils/Constants";
import {
  getHeaderText,
  getMockLoadingTime,
  getOptions,
} from "../../Utils/helpers";
import Chats from "../Chat/Chats";
import ErrorBanner from "../ErrorContainer/ErrorBanner";
import "../Styles/styles.css";

// Initaial state of user selected data
const resetUserData = () => ({
  stage: 1, // Indicates the stage at which user is
  selectedStockExchange: null, // Contains value for selected stock exchange
  selectedStockName: null, // Contains value for stock name for selected stock exchange
});

const createChatMessage = (
  isUser, // This indicates if that chat is from user are bot
  fromUser = "", // This is the chat message from user
  heading = "", // This is the heading for bot chat
  options = [], // These are the option bot will show
  loader // This indicates if the bot reply is loading or not
) => ({
  isUser,
  fromUser,
  heading,
  options,
  loader,
});

const StockChatbot = () => {
  const [chatList, setChatList] = useState([]); // This list contains all the chat history between user and bot
  const [userData, setUserData] = useState(resetUserData()); // This contains current user selected data
  const [loader, setLoader] = useState(false); // For loading of bot messages
  const [error, setError] = useState({
    open: false,
    errorMessage: "",
  });
  const chatBoxRef = useRef(); // Created this ref for auto scroll

  const resetErrorBanner = () => {
    error.open &&
      setError({
        open: false,
        errorMessage: "",
      });
  };
  // This function is called when user select any options
  const handleSelection = (currentValue) => {
    try {
      // removing the error banner if exist
      resetErrorBanner();
      setLoader(true); // Setting the bot loader to true
      if (!currentValue) throw new Error("Invalid selection");

      let updatedUserData = { ...userData };

      if (currentValue === MAIN_MENU) {
        // If the user clicks on main menu, we need to reset the user data to Initaial
        updatedUserData = resetUserData();
      } else if (currentValue === GO_BACK) {
        // If user clicks on go back, we need to decrement stage by 1, keeping rest items as it is.
        updatedUserData.stage = Math.max(1, userData.stage - 1); // Making sure decrement should not be less that 1 (Start).
      } else {
        // Incrementing the stage
        updatedUserData.stage = userData.stage + 1;

        // Assigning values based on the new stage
        if (updatedUserData.stage === 2) {
          updatedUserData.selectedStockExchange = currentValue;
        } else {
          updatedUserData.selectedStockName = currentValue;
        }
      }

      // Getting the options for next stage
      const result = getOptions(localData, updatedUserData);
      if (!result || !Array.isArray(result))
        throw new Error("Failed to fetch options");

      // Checking if the user is at final stage (3) or not
      const isFinalStage = updatedUserData.stage === FINAL_STAGE;
      let optionsList = result;

      // Except Initaial stage for all other stage we need to show "Main menu" and "Go back"
      if (updatedUserData.stage !== 1) {
        optionsList = isFinalStage
          ? mainMenuAndGoBack // For final stage only "Main menu" and "Go back" will be shown in options
          : [...result, ...mainMenuAndGoBack]; // For other stages with other options "Main menu" and "Go back" will be shown
      }

      // Appending the chatList with current selected data
      let newChat = [
        ...chatList,
        createChatMessage(true, currentValue), // Adding user input data in chat
        createChatMessage(false, "", "Thinking...", [], true), // Adding loading text for bot
      ];
      setChatList(newChat);

      // Added this setTimeout to repliacted API call. (Not a mandatory step, just for good UX)
      setTimeout(() => {
        setLoader(false); // Setting loader to false
        newChat.pop(); // Removing the last message which was loading text for bot
        newChat = [
          ...newChat,
          createChatMessage(
            // Creating a new bot message with new options
            false,
            "",
            getHeaderText(
              updatedUserData.stage,
              isFinalStage
                ? `${updatedUserData.selectedStockName} is ${result[0]}` // Adding price value in header for final stage
                : null // For other stages no price value will be shown
            ),
            optionsList
          ),
        ];
        setChatList(newChat);
      }, getMockLoadingTime()); // Getting random time to replicate API call

      // Updating new user state
      setUserData(updatedUserData);
    } catch (error) {
      setLoader(false);
      setError({
        open: true,
        errorMessage: error.message,
      });
      console.error("Error in handleSelection:", error.message);
    }
  };

  const initiateOrRestartChat = () => {
    try {
      // Initaially setting the chat bot message for first user selection
      const initialUserData = resetUserData();
      const result = getOptions(localData, initialUserData);
      if (!result || !Array.isArray(result)) {
        throw new Error("Failed to fetch initial options");
      }

      setChatList([
        createChatMessage(false, "", getHeaderText(), []),
        createChatMessage(
          false,
          "",
          getHeaderText(initialUserData.stage),
          result
        ),
      ]);
      // removing the error banner if exist
      resetErrorBanner();
    } catch (error) {
      setError({
        open: true,
        errorMessage: error.message,
      });
      console.error("Error in initiateOrRestartChat:", error.message);
    }
  };

  // This function is resposible to scroll latest chat in view
  const scrollToLast = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToLast(); // This is called whenever new chat is added in list
  }, [chatList]);

  useEffect(() => {
    // Intiating the first chat on bot load
    initiateOrRestartChat();
  }, []);

  return (
    <div className="chatBoxContainer">
      <div className="chatBotHeader">
        <ChatBotIcon />
        <h1>LSEG Chatbot</h1>
        {!error.open && chatList.length > 2 && (
          // Only show restart button when there is no error and chat started
          <div
            role="button"
            className="restartBtn"
            onClick={initiateOrRestartChat}
          >
            Restart
          </div>
        )}
      </div>
      {error.open && (
        <ErrorBanner
          errorMessage={error.errorMessage}
          handleRetry={initiateOrRestartChat}
        />
      )}
      <div className="chatScreen" ref={chatBoxRef}>
        {chatList.map((chat, index) => (
          <Chats
            key={index}
            {...chat}
            handleSelection={handleSelection}
            isActive={index === chatList.length - 1}
            loader={loader}
          />
        ))}
      </div>
    </div>
  );
};

export default StockChatbot;
