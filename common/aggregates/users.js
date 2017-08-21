import Immutable from 'seamless-immutable';
import crypto from 'crypto';

import type { UserCreated, PasswordChanged } from '../events/users';
import events from '../events/users';
import { Event } from '../helpers';
import throwIfAggregateAlreadyExists from './validators/throwIfAggregateAlreadyExists';
import { authorizationSecret } from '../constants';

const { USER_CREATED, PASSWORD_CHANGED } = events;

export default {
  name: 'users',
  initialState: Immutable({}),
  eventHandlers: {
    [USER_CREATED]: (state, event) =>
      state.merge({
        createdAt: event.timestamp,
        password: event.payload.passwordHash
      }),
    [PASSWORD_CHANGED]: (state, event) =>
      state.set('password', event.payload.newPassword)
  },
  commands: {
    createUser: (state: any, command: UserCreated) => {
      const { name, passwordHash } = command.payload;

      throwIfAggregateAlreadyExists(state, command);

      if (!name) {
        throw new Error('Name is required');
      }

      if (!passwordHash) {
        throw new Error('PasswordHash is required');
      }

      return new Event(USER_CREATED, {
        name,
        passwordHash
      });
    },
    changePassword: (state: any, command: PasswordChanged) => {
      const { newPassword, currentPassword } = command.payload;
      const newPasswordHash = crypto
        .createHmac('sha256', authorizationSecret)
        .update(newPassword)
        .digest('hex');

      const currentPasswordHash = crypto
        .createHmac('sha256', authorizationSecret)
        .update(currentPassword)
        .digest('hex');

      if (state.password !== currentPasswordHash) {
        throw new Error('Current password is incorrect');
      }

      if (newPassword === currentPassword) {
        throw new Error(
          'New password should be different from current password'
        );
      }

      if (!newPassword) {
        throw new Error('New password is empty');
      }

      return new Event(PASSWORD_CHANGED, {
        newPassword: newPasswordHash
      });
    }
  }
};