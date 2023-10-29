import { interpret } from 'xstate';
import { setImmediate } from 'timers';

// prefer scoped amplify js packages for spies
import * as AuthModule from '@aws-amplify/auth';
import { signOutActor } from '../signOut';

jest.mock('aws-amplify');

const signOutSpy = jest.spyOn(AuthModule, 'signOut');
const flushPromises = () => new Promise(setImmediate);

describe('signOutActor', () => {
  it('should transition from pending to resolved when signOut succeeds', async () => {
    signOutSpy.mockResolvedValueOnce(undefined);

    const service = interpret(signOutActor());
    service.start();

    expect(service.getSnapshot().value).toStrictEqual('pending');
    service.send({ type: 'SIGN_OUT' });
    await flushPromises();
    expect(service.getSnapshot().value).toStrictEqual('resolved');
  });

  it('should transition from pending to rejected when signOut fails', async () => {
    const error = new Error('signOut failed');
    signOutSpy.mockRejectedValueOnce(error);
    const service = interpret(signOutActor());
    service.start();

    expect(service.getSnapshot().value).toStrictEqual('pending');
    service.send({ type: 'SIGN_OUT' });
    await flushPromises();

    expect(service.getSnapshot().value).toStrictEqual('rejected');
  });
});
