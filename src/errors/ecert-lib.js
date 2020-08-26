/**
 * Class EcertDocsError class
 *
 *
 * @returns @property {string} message a message error
 * @class
 * @classdesc Class EcertDocsError class
 *
 */
class EcertDocsError extends Error {
  constructor({ message, type, errors } = {}) {
    super();

    this.name = 'EcertDocsError';
    this.message = message;
    this.type = type;
    this.errors = errors;
  }
}

export default EcertDocsError;
