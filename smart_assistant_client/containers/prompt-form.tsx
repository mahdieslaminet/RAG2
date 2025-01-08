"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { checkServerError } from "@/utils/tools";
import { TextInput } from "@/components/text-input";
import { ChatContext } from "@/providers/chat.provider";
import { VoiceRecorder } from "@/components/voice-recorder";
import { PrimaryBtn, PrimaryOutlinedBtn } from "@/components/buttons";
import { usePrompt, useVoicePrompt } from "@/apis/hooks/assistant.hook";
import { promptFormSchema, promptFormSchemaType } from "@/utils/validators";

export const PromptForm = () => {
  const { add, update, remove } = React.useContext(ChatContext);
  const { handleSubmit, control, watch, reset } = useForm<promptFormSchemaType>(
    {
      mode: "all",
      resolver: zodResolver(promptFormSchema),
    }
  );
  const prompt = usePrompt();
  const voicePrompt = useVoicePrompt();
  const q = watch("question");

  const hasQuestion = React.useMemo(() => {
    return !!q?.trim?.();
  }, [q]);

  const onSubmit = async (data: promptFormSchemaType) => {
    if (!data.question) return;
    try {
      const chat = add({ question: data.question, assistant: "" });
      await prompt.mutateAsync({
        question: data.question,
        handler: (data, done) => {
          if (done) return;
          if (!data) return;
          update(chat.id, data);
        },
      });
    } catch (e) {
      checkServerError(e as Error);
    }
  };

  const onSubmitVoiceRecorder = async (blobFile: Blob) => {
    try {
      const form = new FormData();
      form.append("file", blobFile);
      const chat = add({ question: "", assistant: "" });
      await voicePrompt.mutateAsync({
        data: form,
        handler: (data, done) => {
          if (done) return remove(chat.id);
          if (!data) return;
          update(chat.id, data, true);
        },
      });
    } catch (e) {
      checkServerError(e as Error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-y-sm items-center"
    >
      <div className="flex gap-md items-center">
        {hasQuestion && (
          <PrimaryOutlinedBtn
            type="button"
            btnTitle={"حذف"}
            onClick={() => reset({ question: "" })}
            additionalClassName="!w-[50px] !h-[33px] ring-slate-500 hover:bg-slate-200 text-slate-700 text-sm"
          />
        )}
        <Controller
          control={control}
          name="question"
          render={({ field, fieldState: { error } }) => (
            <div className="w-full">
              <TextInput
                dir="rtl"
                hasForm={true}
                placeholder={"سوال خود را وارد کنید"}
                {...field}
              />
              <p className="pt-xs text-xs text-red-600">{error?.message}</p>
            </div>
          )}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        <PrimaryBtn
          btnTitle={"تایید"}
          additionalClassName="w-full !py-xs text-sm !bg-slate-800 hover:!bg-slate-600 disabled:!bg-slate-600"
          isLoading={prompt.isPending}
          disabled={prompt.isPending || voicePrompt.isPending || !hasQuestion}
        />
        <VoiceRecorder
          onSubmit={onSubmitVoiceRecorder}
          disabled={prompt.isPending || voicePrompt.isPending}
        />
      </div>
    </form>
  );
};
