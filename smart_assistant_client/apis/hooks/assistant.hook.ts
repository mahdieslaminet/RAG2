import { useMutation } from "@tanstack/react-query";
import { prompt, voicePrompt } from "../providers/assistant.provider";

export const usePrompt = () =>
  useMutation({ mutationFn: prompt, mutationKey: ["prompt"] });

export const useVoicePrompt = () =>
  useMutation({ mutationFn: voicePrompt, mutationKey: ["voice-prompt"] });
