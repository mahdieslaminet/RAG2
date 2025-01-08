"use client";

import React from "react";
import { PrimaryGhostButton, PrimaryOutlinedBtn } from "./buttons";

interface IVoiceRecorderProps {
  onSubmit: (_: Blob) => void;
  disabled?: boolean;
}
export const VoiceRecorder: React.FC<IVoiceRecorderProps> = ({
  onSubmit,
  disabled = false,
}) => {
  const [voice, setVoice] = React.useState<Blob>();
  // const [voiceUrl, setVoiceUrl] = React.useState<string>();
  const [isRecording, setIsRecording] = React.useState<boolean>(false);

  const audioBlob = React.useRef<BlobPart[]>([]);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);

  const reset = () => {
    setVoice(undefined);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
        video: false,
      });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = async (event) => {
        audioBlob.current.push(event.data);
      };

      mediaRecorderRef.current.addEventListener("stop", async () => {
        const blob = new Blob(audioBlob.current, { type: "audio/ogg" });
        setVoice(blob);
        setIsRecording(false);
        audioBlob.current = [];
        mediaRecorderRef.current = null;

        // const fileReader = new FileReader();
        // fileReader.readAsDataURL(blob);
        // fileReader.onloadend = function () {
        //   const newData = (fileReader.result as string).split(";");
        //   setVoiceUrl(`data:audio/ogg;${newData[1]}`);
        // };
      });

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop?.();
  };

  return (
    <>
      {!voice && isRecording && (
        <PrimaryGhostButton
          onClick={stopRecording}
          btnTitle={"توقف"}
          disabled={disabled}
          type="button"
          additionalClassName="w-full bg-slate-300 hover:bg-slate-300/70 text-slate-700 text-sm"
        />
      )}
      {!voice && !isRecording && (
        <PrimaryGhostButton
          onClick={startRecording}
          btnTitle={"ضبط صدا"}
          disabled={disabled}
          type="button"
          additionalClassName="w-full bg-slate-300 hover:bg-slate-300/70 text-slate-700 text-sm"
        />
      )}
      {!!voice && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
          <PrimaryGhostButton
            onClick={() => onSubmit(voice)}
            btnTitle={"ارسال"}
            disabled={disabled}
            type="button"
            additionalClassName="w-full bg-slate-300 hover:bg-slate-300/70 text-slate-700 text-sm"
          />
          <PrimaryOutlinedBtn
            onClick={reset}
            btnTitle={"حذف صدا"}
            disabled={disabled}
            type="button"
            additionalClassName="w-full ring-slate-500 hover:bg-slate-200 text-slate-700 text-sm"
          />
        </div>
      )}
    </>
  );
};
