interface IStreamEvent {
  handler: (data: string, done: boolean) => void;
}

interface IPromptReqDto extends IStreamEvent {
  question: string;
}

interface IVoicePromptReqDto extends IStreamEvent {
  data: FormData;
}
