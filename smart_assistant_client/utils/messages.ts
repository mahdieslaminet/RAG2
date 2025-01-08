const generateServerErrors = () => {
  const base: { [key: string]: string } = {
    "401": "Session expired or invalid.",
    "403": "Forbidden from accessing.",
    "404": "Not found.",
    "409": "Conflict.",
    "400": "Bad request.",
    "406": "Not acceptable.",
  };
  for (let status = 500; status < 600; status++) {
    base[status.toString()] = "Server error.";
  }
  return base;
};

export const serverErrors: { [key: string]: string } = generateServerErrors();
