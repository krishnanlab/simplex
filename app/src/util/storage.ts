const prefix = "simplex-";

/** simple set interface for local storage */
export const setStorage = (
  key: string,
  value: string | ((value: string) => string)
) => {
  try {
    const currentValue = getStorage(prefix + key);
    const newValue = typeof value === "function" ? value(currentValue) : value;
    window.localStorage.set(prefix + key, newValue);
    return true;
  } catch (error) {
    return false;
  }
};

/** simple get interface for local storage */
export const getStorage = (key: string) => {
  try {
    return window.localStorage.get(prefix + key);
  } catch (error) {
    return "";
  }
};
