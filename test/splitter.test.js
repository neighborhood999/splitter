import { expect, assert } from 'chai';
import { BigNumber } from 'bignumber.js';
import web3Utils from 'web3-utils';

const Splitter = artifacts.require('Splitter');

const logEvent = ({ logs: [log] }) => log;

contract('Splitter Contract', accounts => {
  const [Alice, Bob, Carol] = accounts;

  let contract;
  beforeEach('Deploy new contract instance', async () => {
    contract = await Splitter.new({ from: Alice });
  });

  describe('split function', () => {
    it('should be hold 2 ether in contract before split', async () => {
      const value = web3Utils.toWei('2', 'ether');
      const {
        logs: [log]
      } = await contract.split(Bob, Carol, { from: Alice, value });
      const contractHoldEther = await web3.eth.getBalance(log.address);

      expect(contractHoldEther.toString(10)).to.equal(value.toString(10));
    });

    it('should be split 2 ether to the bob and carol', async () => {
      const value = web3Utils.toWei('2', 'ether');

      await contract.split(Bob, Carol, { from: Alice, value });

      const recipientBob = await contract.balances(Bob);
      const recipientCarol = await contract.balances(Carol);

      const ether = BigNumber(value);
      expect(recipientBob.toString(10)).to.equal(ether.div(2).toString(10));
      expect(recipientCarol.toString(10)).to.equal(ether.div(2).toString(10));
    });

    it('should fail if send the 0 ether', async () => {
      const value = web3Utils.toWei('0', 'ether');

      try {
        await contract.split(Bob, Carol, { from: Alice, value });
      } catch (err) {
        assert.include(err.message, 'revert');
      }
    });

    it('should fail if the recipient are the same', async () => {
      const value = web3Utils.toWei('2', 'ether');

      try {
        await contract.split(Bob, Bob, { from: Alice, value });
      } catch (err) {
        assert.include(err.message, 'revert');
      }
    });

    it('should fail if the recipient Bob address is empty', async () => {
      const value = web3Utils.toWei('2', 'ether');

      try {
        await contract.split('0x0', Carol, { from: Alice, value });
      } catch (err) {
        assert.include(err.message, 'revert');
      }
    });

    it('should fail if the recipient Carol address is empty', async () => {
      const value = web3Utils.toWei('2', 'ether');

      try {
        await contract.split(Bob, '0x0', { from: Alice, value });
      } catch (err) {
        assert.include(err.message, 'revert');
      }
    });
  });

  describe('split emit event', () => {
    it('should emit LogSplit', async () => {
      const value = web3Utils.toWei('2', 'ether');
      const tx = await contract.split(Bob, Carol, { from: Alice, value });
      const log = logEvent(tx);

      expect(log.event).to.equal('LogSplit');
      expect(log.args.from).to.equal(Alice);
      expect(log.args.toFirstRecipient).to.equal(Bob);
      expect(log.args.toSecondRecipient).to.equal(Carol);
      expect(log.args.amount.toString(10)).to.equal(
        BigNumber(value)
          .div(2)
          .toString(10)
      );
    });

    it('should emit LogWithdraw', async () => {
      const value = web3Utils.toWei('2', 'ether');
      const tx = await contract.split(Bob, Carol, { from: Alice, value });
      const withdraw = await contract.withdraw({ from: Bob });

      const txLogEvent = logEvent(tx);
      expect(txLogEvent.event).to.equal('LogSplit');
      expect(txLogEvent.args.from).to.equal(Alice);
      expect(txLogEvent.args.toFirstRecipient).to.equal(Bob);
      expect(txLogEvent.args.toSecondRecipient).to.equal(Carol);

      const withdrawLogEvent = logEvent(withdraw);
      expect(withdrawLogEvent.event).to.equal('LogWithdraw');
      expect(withdrawLogEvent.args.from).to.equal(Bob);
      expect(withdrawLogEvent.args.amount.toString(10)).to.equal(
        BigNumber(value)
          .div(2)
          .toString(10)
      );
    });
  });
});
