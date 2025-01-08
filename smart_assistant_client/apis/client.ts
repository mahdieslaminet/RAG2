"use client";

import axios, { AxiosInstance } from "axios";

export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL as string;

const baseHeaders = (isForm = false, stream = false) => {
  const headers: { [key: string]: string } = {
    Accept: "application/json",
    "Content-Type": isForm ? "multipart/form-data" : "application/json",
  };
  if (stream) headers["responseType"] = "stream";
  return headers;
};

export const getProviderClient = (
  isForm = false,
  stream = false
): AxiosInstance => {
  return axios.create({
    baseURL: SERVER_URL,
    headers: baseHeaders(isForm, stream),
  });
};
