import { classNames } from "@/utils/tools";
import { ChatsList } from "@/containers/chats-list";
import { PromptForm } from "@/containers/prompt-form";
import { ChatProvider } from "@/providers/chat.provider";

const HomePage: React.FC = () => {
  return (
    <main
      className={classNames(
        "container mx-auto min-h-screen flex flex-col-reverse",
        "pb-xl pt-md px-sm sm:px-lg justify-between gap-xl"
      )}
    >
      <ChatProvider>
        <div className="w-full max-w-[600px] mx-auto">
          <PromptForm />
        </div>
        <div className="w-full max-w-[1000px] mx-auto">
          <ChatsList />
        </div>
      </ChatProvider>
    </main>
  );
};

export default HomePage;
