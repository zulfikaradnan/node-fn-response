const { isNaN, isNumber } = require('@zulfikaradnan/types');

/**
 * Execute
 * @param {number} status 100 - 599
 * @param {string} message The message response
 * @param {any} body The content response
 * @param {any} headers The headers response
 * @returns {object} etc { status: 200, message: "Ok", ... }
 */
const execute = (status, message, body, headers) => {
  // eslint-disable-next-line radix
  let statusCode = parseInt(status);
  if (isNumber(status) || !isNaN(statusCode)) {
    statusCode = statusCode >= 100 && statusCode <= 599 ? statusCode : 500;
  }

  const result = { status, message };

  if (statusCode >= 400) {
    let errors = [];
    if (Array.isArray(body)) {
      errors = body.filter(val => val instanceof Error);
    }
    if (body instanceof Error) {
      errors = [body];
    }

    errors = errors.map(err => ({
      status: err.status,
      code: err.code,
      title: err.title,
      detail: err.message,
      source: err.source
    }));

    result.errors = errors;

  } else {
    result.body = body;
  }

  result.headers = headers;
  return result;
};

module.exports = {
  category: 'core',
  title: 'Http Response',
  description: '',
  execute
};
