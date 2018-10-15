import { assert } from 'chai';

async function expectedException(promise) {
  try {
    await promise;
    assert.fail('Expected throw not received');
  } catch (error) {
    const invalidJump = error.message.search('invalid JUMP') > -1;
    const invalidOpcode = error.message.search('invalid opcode') > -1;
    const outOfGas = error.message.search('out of gas') > -1;
    const revert = error.message.search('revert') > -1;

    assert(
      invalidJump || invalidOpcode || outOfGas || revert,
      `Expected throw, got ' ${error} ' instead`
    );
  }
}

export default expectedException;
