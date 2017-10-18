// @flow
import { USER_CREATED } from '../events'

export default {
  name: 'user',
  initialState: {},
  commands: {
    createUser: (state: any, command: any) => {
      if (state.createdAt !== undefined) {
        throw new Error('User already exists')
      }

      const { name } = command.payload

      if (!name) {
        throw new Error('Name is required')
      }

      const payload: UserCreatedPayload = { name }
      return { type: USER_CREATED, payload }
    }
  },
  projection: {
    [USER_CREATED]: (state, { timestamp }) => ({
      ...state,
      createdAt: timestamp
    })
  }
}