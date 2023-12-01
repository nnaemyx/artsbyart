export const saveUserToLocalStorage = (user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('users', JSON.stringify(user));
    }
  };
  
  
  export const getUserFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('users');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      return parsedUser
    }
    return null;
  };
  
  export const getPhoneFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('users');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      // Extract and return only the phone number
      return parsedUser ? parsedUser?.newUser?.phone : null;
    }
    return null;
  };

  
  
  export const removeUserFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('users');
    }
  };