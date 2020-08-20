import EcertDocsError from '../errors/ecert-lib';

export const isRequired = (field, value) => {
  if (value) return value;
  throw new EcertDocsError({
    message: 'Erro ao adicionar participante.',
    type: 'validation_error',
    errors: [
      {
        message: `O Campo "${field}" é obrigatório`,
      },
    ],
  });
};

export const capitalizeFirstLetter = (text) =>
  `${text.charAt(0).toUpperCase()}${text.toLowerCase().slice(1)}`;

export const isValidEmail = (email) => {
  const regexMail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regexMail.test(email);
};
