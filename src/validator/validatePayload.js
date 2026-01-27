import InvariantError from '../exceptions/InvariantError.js';

const validatePayload = (schema, payload, options) => {
  const { error } = schema.validate(payload);

  if (error) {
    const detail = error.details[0];
    const fieldMap = options.fieldMap || {};
    const prefix = options.prefix || 'Data tidak valid';

    const field = fieldMap[detail.context.key] || detail.context.key;

    let message = 'Data tidak valid';

    switch (detail.type) {
      case 'any.required':
        message = `kolom ${field} wajib diisi`;
        break;
      case 'string.empty':
        message = `kolom ${field} tidak boleh kosong`;
        break;
      case 'number.base':
        message = `kolom ${field} harus berupa angka`;
        break;
      case 'number.min':
      case 'number.max':
        message = `kolom ${field} tidak boleh kurang dari 1900 atau lebih dari ${detail.context.limit}`;
        break;
      default:
        message = `kolom ${field} tidak valid`;
    }

    throw new InvariantError(`${prefix}. ${message}`);
  }
};

export default validatePayload;
