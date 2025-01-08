"use client";

import React from "react";

import { ChatCard } from "@/components/chat-card";
import { ChatContext } from "@/providers/chat.provider";

export const ChatsList: React.FC = () => {
  const { chats } = React.useContext(ChatContext);

  return (
    <section className="grid grid-cols-1 gap-md">
      {chats.map((el) => (
        <ChatCard key={el.id} {...el} />
      ))}
      {!chats?.length && (
        <p className="text-center text-lg font-medium">
          متن مورد نظر را وارد و سپس دکمه تایید را بزنید
        </p>
      )}
    </section>
  );
};
