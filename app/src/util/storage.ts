/** simple set interface for local storage */
export const setStorage = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
};

/** simple get interface for local storage */
export const getStorage = (key: string): unknown => {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "");
  } catch (error) {
    return null;
  }
};
