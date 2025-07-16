import joi from 'joi';
// for the dob
const today = new Date();
const minDOB = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate()); // At least 15 years old
const maxDOB = new Date(today.getFullYear() - 70, today.getMonth(), today.getDate()); // Max 70 years old

const signUpJoiSchema = joi.object({
  userName: joi
    .string()
    .min(3)
    .max(30)
    .required()
    .pattern(/^[a-zA-Z_ ]+$/)
    .messages({
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 30 characters',
      'string.pattern.base': 'Username must only contain letters, underscores, and spaces',
      'any.required': 'Username is required',
    }),

  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email':
        'Please enter a valid email address (e.g., user@example.com)',
      'any.required': 'Email is required',
    }),

  password: joi
    .string()
    .min(8)
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/)
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base':
        'Password must contain uppercase, lowercase, number, and special character (!@#$%^&*)',
      'any.required': 'Password is required',
    }),

  confirmedPassword: joi
    .string()
    .valid(joi.ref('password'))
    .required()
    .messages({
      'any.required': 'Confirm Password is required',
      'any.only': 'Passwords do not match',
    }),

  phone: joi
    .string()
    .pattern(/^01[0125][0-9]{8}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Phone number must be an Egyptian number (01xxxxxxxxx)',
      'any.required': 'Phone number is required',
    }),
    
    dob: joi.date()
    .iso() // → YYYY-MM-DD format
    .less(minDOB) // → at least 15 years old
    .greater(maxDOB) // → not older than 70
    .required()
    .messages({
      "date.format": "Date of birth must be in YYYY-MM-DD format",
      "date.base": "Date of birth must be a valid date",
      "date.less": "You must be at least 15 years old",
      "date.greater": "You must not be older than 70 years old",
      "any.required": "Date of birth is required",
    }),
  

  address: joi.string().min(7).max(50).required().messages({
    'string.min': 'Address should be at least 7 characters',
    'string.max': 'Address should be at most 50 characters',
    'any.required': 'Address is required',
  }),

  idNumber: joi
  .string()
  .pattern(/^[2-3][0-9]{13}$/)
  .required()
  .custom((value, helpers) => {
    const dob = helpers.state.ancestors[0]?.dob;
    if (!dob) return value; // Skip check if dob not present (will be handled by dob field)

    const dobDate = new Date(dob);
    const year = dobDate.getFullYear();
    const month = String(dobDate.getMonth() + 1).padStart(2, '0');
    const day = String(dobDate.getDate()).padStart(2, '0');

    const idCentury = value.charAt(0) === '2' ? 1900 : 2000;
    const idYear = parseInt(value.substring(1, 3), 10);
    const idMonth = value.substring(3, 5);
    const idDay = value.substring(5, 7);
    const fullIdYear = idCentury + idYear;

    if (
      fullIdYear !== year ||
      idMonth !== month ||
      idDay !== day
    ) {
      return helpers.message('ID Number does not match Date of Birth');
    }

    return value;
  })
  .messages({
    'string.pattern.base':
      'ID Number must start with 2 or 3 and be 14 digits total',
    'any.required': 'ID Number is required',
  }),


  gender: joi.string().valid('male', 'female').required().messages({
    'any.required': 'Gender is required',
    'any.only': 'Gender must be either "male" or "female"',
  }),


});

// sign In validations schema
const signInJoiSchema = joi.object({
    identifier: joi
      .string()
      .required()
      .messages({
        "any.required": "Email or phone number is required",
      }),
  password: joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required',
  }),
});

// joi schema for updating user profile he can only update his username, phone, email, and password
 const updateUserSchema = joi.object({
  userName: joi
  .string()
  .min(3)
  .max(30)
  .pattern(/^[a-zA-Z_ ]+$/)
  .messages({
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username cannot exceed 30 characters',
    'string.pattern.base': 'Username must only contain letters, underscores, and spaces',
  }),
  phone: joi.string().pattern(/^01[0125][0-9]{8}$/).messages({
    'string.pattern.base': 'Phone must be a valid Egyptian number (01xxxxxxxxx)',
  }),
  password: joi
  .string()
  .min(8)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/)
  .messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.pattern.base':
      'Password must contain uppercase, lowercase, number, and special character (!@#$%^&*)'
  }),
  email: joi
  .string()
  .email()
  .messages({
    'string.email':
      'Please enter a valid email address (e.g., user@example.com)',
  }),
  
}).unknown(false); //  Disallow extra fields like role, confirmEmail,etc..


export { signUpJoiSchema, signInJoiSchema, updateUserSchema };
