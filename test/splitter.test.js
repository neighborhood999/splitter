import { expect, assert } from 'chai';
import { BigNumber } from 'bignumber.js';

const Splitter = artifacts.require('Splitter');

const logEvent = ({ logs: [log] }) => log;

contract('Splitter', accounts => {
  const [Alice, Bob, Carol] = accounts;

  let contract;
  beforeEach('Deploy new contract instance', async () => {
    contract = await Splitter.new({ from: Alice });
  });

  describe('split function', () => {
    it('should be hold 2 ether in contract before split', async () => {
      const value = web3.toWei('1', 'ether');
      const tx = await contract.split(Bob, Carol, { from: Alice, value });
      const contractAddress = logEvent(tx).address;
      const contractHoldEther = web3.eth.getBalance(contractAddress);

      expect(contractHoldEther.toString(10)).to.equal(value.toString(10));
    });

    it('should be split 2 ether to the bob and carol', async () => {
      const value = web3.toWei('1', 'ether');

      await contract.split(Bob, Carol, { from: Alice, value });

      const recipientBob = await contract.balances(Bob);
      const recipientCarol = await contract.balances(Carol);
      const amount = BigNumber(value).dividedToIntegerBy(2);

      expect(recipientBob.toString(10)).to.equal(amount.toString(10));
      expect(recipientCarol.toString(10)).to.equal(amount.toString(10));
    });

    it('should be split wei to the recipient and deposit remainder', async () => {
      const value = web3.fromWei('1000000000000000001', 'wei');

      await contract.split(Bob, Carol, { from: Alice, value });

      const recipientBob = await contract.balances(Bob);
      const recipientCarol = await contract.balances(Carol);
      const senderAlice = await contract.balances(Alice);

      expect(recipientBob.toString(10)).to.equal(web3.toWei('500', 'finney'));
      expect(recipientCarol.toString(10)).to.equal(web3.toWei('500', 'finney'));
      expect(senderAlice.toString(10)).to.equal(web3.fromWei('1', 'wei'));
    });

    it('should be fail if send the 0 ether', async () => {
      const value = web3.toWei('0', 'ether');

      try {
        await contract.split(Bob, Carol, { from: Alice, value });
      } catch (err) {
        assert.include(err.message, 'revert');
      }
    });

    it('should be fail if the recipient are the same', async () => {
      const value = web3.toWei('2', 'ether');

      try {
        await contract.split(Bob, Bob, { from: Alice, value });
      } catch (err) {
        assert.include(err.message, 'revert');
      }
    });

    it('should be fail if the recipient Bob address is empty', async () => {
      const value = web3.toWei('2', 'ether');

      try {
        await contract.split('0x0', Carol, { from: Alice, value });
      } catch (err) {
        assert.include(err.message, 'revert');
      }
    });

    it('should be fail if the recipient Carol address is empty', async () => {
      const value = web3.toWei('2', 'ether');

      try {
        await contract.split(Bob, '0x0', { from: Alice, value });
      } catch (err) {
        assert.include(err.message, 'revert');
      }
    });
  });

  describe('split emit event', () => {
    it('should be emit LogSplit', async () => {
      const value = web3.toWei('1', 'ether');
      const tx = await contract.split(Bob, Carol, { from: Alice, value });
      const log = logEvent(tx);

      expect(log.event).to.equal('LogSplit');
      expect(log.args.from).to.equal(Alice);
      expect(log.args.recipient1).to.equal(Bob);
      expect(log.args.recipient2).to.equal(Carol);
      expect(log.args.amount.toString(10)).to.equal(
        BigNumber(value)
          .dividedToIntegerBy(2)
          .toString(10)
      );
    });

    it('should be emit LogWithdraw', async () => {
      const value = web3.toWei('1', 'ether');
      const tx = await contract.split(Bob, Carol, { from: Alice, value });
      const withdraw = await contract.withdraw({ from: Bob });

      const txLogEvent = logEvent(tx);
      expect(txLogEvent.event).to.equal('LogSplit');
      expect(txLogEvent.args.from).to.equal(Alice);
      expect(txLogEvent.args.recipient1).to.equal(Bob);
      expect(txLogEvent.args.recipient2).to.equal(Carol);

      const withdrawLogEvent = logEvent(withdraw);
      expect(withdrawLogEvent.event).to.equal('LogWithdraw');
      expect(withdrawLogEvent.args.from).to.equal(Bob);
      expect(withdrawLogEvent.args.amount.toString(10)).to.equal(
        BigNumber(value)
          .dividedToIntegerBy(2)
          .toString(10)
      );
    });
  });
});
