export const getFormJSON = (form) => {
  const data = new FormData(form);
  return Array.from(data.keys()).reduce((result, key) => {
    if (result[key]) {
      result[key] = data.getAll(key);
      return result;
    }
    result[key] = data.get(key);
    return result;
  }, {});
};
