"use client";

import { classNames } from "@/utils/tools";

export const ChatCard: React.FC<IChat> = ({ question, assistant }) => {
  return (
    <section
      dir="rtl"
      className={classNames(
        "text-lg font-medium bg-slate-200 py-sm px-md",
        "rounded-2xl border border-slate-300 space-y-sm"
      )}
    >
      <div className="space-y-1">
        <p>سوال:</p>
        <p>{question}</p>
      </div>
      <div className="space-y-1">
        <p>پاسخ:</p>
        <div
          className="w-full"
          dangerouslySetInnerHTML={{
            __html: (assistant || "")
              .replaceAll(/\/n/g, "</br>")
              .replaceAll(/\<\/br\>$/g, "")
              .replaceAll(/^\<\/br\>/g, ""),
          }}
        ></div>
      </div>
    </section>
  );
};
