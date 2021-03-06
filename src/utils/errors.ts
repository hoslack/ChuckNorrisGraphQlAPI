import { createError } from 'apollo-errors';

export const UserError = createError('UserError', {
  message: 'User does not exist'
});

export const AuthError = createError('AuthError', {
  message: 'Wrong email or password'
});

export const ConflictError = createError('AuthError', {
  message: 'User already exists'
});