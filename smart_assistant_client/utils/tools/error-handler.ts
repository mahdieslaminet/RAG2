/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { serverErrors } from "../messages";

const parseErrorMessage = (
  message: string | string[],
  withoutSlice = false
) => {
  let msg: string = message as string;
  if (message instanceof Array) {
    msg = message.join(", ");
  }
  return msg.length >
    Number(process.env.NEXT_PUBLIC_ERROR_MESSAGE_LENGTH || 0) && !withoutSlice
    ? `${msg.slice(
        0,
        Number(process.env.NEXT_PUBLIC_ERROR_MESSAGE_LENGTH || 0)
      )}...`
    : msg;
};

const showMessage = (error: IServerError, pureError: AxiosError) =>
  toast.error(
    `${serverErrors[error.statusCode.toString()]}\n${
      !!pureError.message ? `${parseErrorMessage(error.message)}.` : ""
    }`
  );

export const checkServerError = (
  e: AxiosError | Error,
  disableLogout = false,
  cbStatusCode?: number,
  cb?: (_: string) => unknown
): boolean | null => {
  if (e instanceof Error) {
    showMessage({ error: "Error", message: e.message, statusCode: 500 }, {
      message: e.message,
    } as AxiosError);
    return false;
  }
  if ((e as AxiosError).code === "ERR_NETWORK") {
    toast.error(serverErrors["500"]);
    return false;
  }
  if (!("response" in e) || !(e as AxiosError).response?.data) return false;
  const error: IServerError = (e as AxiosError).response?.data as IServerError;
  if (!!cbStatusCode && !!cb) {
    if (cbStatusCode === error.statusCode) {
      cb(
        `${serverErrors[error.statusCode.toString()]}\n${
          !!(e as any).message
            ? `${parseErrorMessage(error.message, true)}.`
            : ""
        }`
      );
    }
  }
  const unauthorized = error.statusCode === 403 || error.statusCode === 401;
  if (!unauthorized) {
    showMessage(error, e);
  } else if (unauthorized && !disableLogout) {
    showMessage(error, e);
    window.location.href = "/logout";
  }
  if (error.statusCode === 404) return null;
  return error.statusCode === 401;
};
