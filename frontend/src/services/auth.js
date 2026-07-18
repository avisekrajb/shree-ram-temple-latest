export const getToken = () => {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    localStorage.setItem('token', token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

export const getUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const setUser = (user) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

export const removeUser = () => {
  try {
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error removing user:', error);
  }
};

export const getLanguage = () => {
  try {
    return localStorage.getItem('lang') || 'en';
  } catch {
    return 'en';
  }
};

export const setLanguage = (lang) => {
  try {
    localStorage.setItem('lang', lang);
  } catch (error) {
    console.error('Error saving language:', error);
  }
};