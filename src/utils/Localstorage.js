export const saveUserToLocalStorage = (user) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("users", JSON.stringify(user));
  }
};

export const getUserFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("users");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    return parsedUser;
  }
  return null;
};

export const getPhoneFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("users");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    // Extract and return only the phone number
    return parsedUser ? parsedUser?.newUser?.phone : null;
  }
  return null;
};

export const removeUserFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("users");
  }
};

export const saveICToLocalStorage = (ic) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("ics", JSON.stringify(ic));
  }
};

export const getICFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const storedValue = localStorage.getItem("is_verified");
    if (storedValue !== null) {
      return JSON.parse(storedValue);
    }
  }
  return null;
};

export const getICsFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const storedValue = localStorage.getItem("ics");
    if (storedValue !== null) {
      return JSON.parse(storedValue);
    }
  }
  return null;
};

