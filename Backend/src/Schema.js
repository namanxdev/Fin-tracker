import Joi from 'joi';
import sanitizeHtml from 'sanitize-html';

// Create HTML escaping extension
const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!'
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {}
        });
        if (clean !== value) return helpers.error('string.escapeHTML', { value });
        return clean;
      }
    }
  }
});

// Extended Joi with HTML sanitization
export const ExtendedJoi = Joi.extend(extension);

// Updates to match your controller requirements:
export const expenseSchema = ExtendedJoi.object({
  title: ExtendedJoi.string().required().escapeHTML(),
  amount: ExtendedJoi.number().required().min(0),
  category: ExtendedJoi.string().required().escapeHTML(),
  description: ExtendedJoi.string().allow('').escapeHTML(),
  date: ExtendedJoi.date().allow(null),
  paymentMethod: ExtendedJoi.string().allow('').escapeHTML(),
  isRecurring: ExtendedJoi.boolean().default(false)
});

export const budgetSchema = ExtendedJoi.object({
  category: ExtendedJoi.string().required().escapeHTML(),
  limit: ExtendedJoi.number().required().min(0),
  period: ExtendedJoi.string().valid('daily','monthly', 'weekly', 'yearly','quarterly').default('monthly'),
  startDate: ExtendedJoi.date().allow(null,''),
  endDate: ExtendedJoi.date().allow(null,''),
  rollover: ExtendedJoi.boolean().default(false),
  description: ExtendedJoi.string().allow('').escapeHTML()
});

export const incomeSchema = ExtendedJoi.object({
  title: ExtendedJoi.string().required().escapeHTML(),
  amount: ExtendedJoi.number().required().min(0),
  category: ExtendedJoi.string().required().escapeHTML(),
  description: ExtendedJoi.string().allow('').escapeHTML(),
  date: ExtendedJoi.date().allow(null),
  source: ExtendedJoi.string().allow('').optional().escapeHTML(),
  isRecurring: ExtendedJoi.boolean().default(false),
  recurringFrequency: ExtendedJoi.string().valid('daily', 'weekly', 'monthly', 'yearly', 'none').default('none')
});

// User registration schema
export const userRegisterSchema = ExtendedJoi.object({
  name: ExtendedJoi.string().required().escapeHTML(),
  email: ExtendedJoi.string().email().required().escapeHTML(),
  password: ExtendedJoi.string().min(8).required()
});

// User login schema
export const userLoginSchema = ExtendedJoi.object({
  email: ExtendedJoi.string().email().required().escapeHTML(),
  password: ExtendedJoi.string().required()
});

// Profile update schema
export const profileUpdateSchema = ExtendedJoi.object({
  username: ExtendedJoi.string().escapeHTML(),
  email: ExtendedJoi.string().email().escapeHTML(),
  firstName: ExtendedJoi.string().allow('').escapeHTML(),
  lastName: ExtendedJoi.string().allow('').escapeHTML()
});

// Password change schema
export const passwordChangeSchema = ExtendedJoi.object({
  currentPassword: ExtendedJoi.string().required(),
  newPassword: ExtendedJoi.string().min(8).required()
});