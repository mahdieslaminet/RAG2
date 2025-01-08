"use client";

import React, { createContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { startAudioTag, stopAudioTag } from "@/utils";

const removeAudioTag = (text: string) => {
  return text
    .replace(startAudioTag, "")
    .replace(stopAudioTag, "")
    .replace("`" + startAudioTag, "")
    .replace("`" + stopAudioTag, "")
    .replace(startAudioTag + "`", "")
    .replace(stopAudioTag + "`", "");
};

export const ChatContext = createContext<{
  chats: Array<IChat>;
  add: (_: Omit<IChat, "id">) => IChat;
  update: (id: string, text: string, question?: boolean) => void;
  remove: (id: string) => void;
}>({
  chats: [],
  add: function (): IChat {
    throw new Error("Function not implemented.");
  },
  update: function (): void {
    throw new Error("Function not implemented.");
  },
  remove: function (): void {
    throw new Error("Function not implemented.");
  },
});

export const ChatProvider: React.FC<IChildren> = ({ children }) => {
  const [chats, setChats] = useState<Array<IChat>>([]);

  const add = (chat: Omit<IChat, "id">) => {
    const newChat: IChat = { ...chat, id: uuidv4(), mainText: "" };
    setChats([...chats, { ...newChat }]);
    return newChat;
  };

  const remove = (id: string) => {
    setChats((chats) => {
      return [...chats].map((chat) => {
        if (chat.id !== id) return chat;
        return { ...chat, mainText: "" };
      });
    });
  };

  const update = (id: string, newChat: string, question = false) => {
    setChats((chats) => {
      return [...chats].map((chat) => {
        if (chat.id !== id) return chat;
        if (question) {
          let mainText = chat.mainText + newChat;
          if (mainText.includes(startAudioTag)) {
            mainText = mainText.replace(startAudioTag, "");
          }
          const needSplit = mainText.includes(stopAudioTag);
          if (!needSplit)
            return { ...chat, mainText, question: mainText, assistant: "" };
          const [question, assistant] = mainText.split(stopAudioTag);
          return {
            ...chat,
            mainText,
            question,
            assistant,
          };
        }
        return {
          ...chat,
          assistant: removeAudioTag(chat.assistant + newChat),
        };
      });
    });
  };

  return (
    <ChatContext.Provider value={{ chats, add, update, remove }}>
      {children}
    </ChatContext.Provider>
  );
};
