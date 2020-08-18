export const isRequired = (field, value) => {
  if (value) return value;
  throw new Error(`O Campo "${field}" é obrigatório`);
};

export const capitalizeFirstLetter = (text) =>
  `${text.charAt(0).toUpperCase()}${text.toLowerCase().slice(1)}`;
