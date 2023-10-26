/**
 * This file contains helpers that process authenticator state machine context
 */

import {
  LoginMechanismArray,
  AuthContext,
  AuthMachineState,
} from '../../types';

export const getPrimaryAlias = (state: AuthMachineState) => {
  const loginMechanisms = state?.context.config?.loginMechanisms;
  /**
   * @migration this is where we grab only the first index of `aws_cognito_username_attributes`
   */
  const [primaryAlias] = loginMechanisms ?? ['username'];
  return primaryAlias;
};

/**
 * Given xstate context from AuthMachine, returns the primaryAlias and
 * secondaryAliases.
 */
export const getConfiguredAliases = (context: AuthContext) => {
  const loginMechanisms = context.config?.loginMechanisms;
  const aliases =
    loginMechanisms?.filter((mechanism) =>
      LoginMechanismArray.includes(mechanism)
    ) ?? [];

  const [primaryAlias, ...secondaryAliases] = aliases;
  return { primaryAlias, secondaryAliases };
};
