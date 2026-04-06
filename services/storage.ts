const storage = {
  set: (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value)),
  get: (key: string) => JSON.parse(localStorage.getItem(key) || 'null'),
  remove: (key: string) => localStorage.removeItem(key),
};
export default storage;
