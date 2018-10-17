import { expect } from 'chai';
import { BigNumber } from 'bignumber.js';
import expectedException from '../utils/expectedException';

const Splitter = artifacts.require('Splitter');

const logEvent = ({ logs: [log] }) => log;
const pGetBalance = address =>
  new Promise((resolve, reject) => {
    web3.eth.getBalance(address, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });

contract('Splitter', accounts => {
  const [alice, bob, carol] = accounts;

  let splitter;
  beforeEach('Deploy new contract instance', async () => {
    splitter = await Splitter.new({ from: alice });
  });

  describe('split function', () => {
    it('should be hold 0.1 ether in contract before split', async () => {
      const value = web3.toWei('0.1', 'ether');
      await splitter.split(bob, carol, { from: alice, value });

      const contractAddress = splitter.address;
      const contractHoldEther = await pGetBalance(contractAddress);

      expect(contractHoldEther.toString(10)).to.equal(value.toString(10));
    });

    it('should be split 0.1 ether to the bob and carol', async () => {
      const value = web3.toWei('0.1', 'ether');

      await splitter.split(bob, carol, { from: alice, value });

      const recipientBob = await splitter.balances(bob);
      const recipientCarol = await splitter.balances(carol);
      const amount = BigNumber(value).dividedToIntegerBy(2);

      expect(recipientBob.toString(10)).to.equal(amount.toString(10));
      expect(recipientCarol.toString(10)).to.equal(amount.toString(10));
    });

    it('should be split wei to the recipient and deposit remainder', async () => {
      const value = new BigNumber(web3.toWei('1', 'ether')).plus(1).toString(10);

      await splitter.split(bob, carol, { from: alice, value });

      const recipientBob = await splitter.balances(bob);
      const recipientCarol = await splitter.balances(carol);
      const senderAlice = await splitter.balances(alice);

      expect(recipientBob.toString(10)).to.equal(web3.toWei('500', 'finney'));
      expect(recipientCarol.toString(10)).to.equal(web3.toWei('500', 'finney'));
      expect(senderAlice.toString(10)).to.equal(web3.fromWei('1', 'wei'));
    });

    it('should be fail if send the 0 ether', async () => {
      const value = web3.toWei('0', 'ether');

      await expectedException(
        () => splitter.split(bob, carol, { from: alice, value }),
        3000000
      );
    });

    it('should be fail if the recipient are the same', async () => {
      const value = web3.toWei('0.1', 'ether');

      await expectedException(
        () => splitter.split(bob, bob, { from: alice, value }),
        3000000
      );
    });

    it('should be fail if the recipient Bob address is empty', async () => {
      const value = web3.toWei('0.1', 'ether');

      await expectedException(
        () => splitter.split('0x0', carol, { from: alice, value }),
        3000000
      );
    });

    it('should be fail if the recipient Carol address is empty', async () => {
      const value = web3.toWei('0.1', 'ether');

      await expectedException(
        () => splitter.split(bob, '0x0', { from: alice, value }),
        3000000
      );
    });
  });

  describe('split emit event', () => {
    it('should be emit LogSplit', async () => {
      const value = web3.toWei('0.1', 'ether');
      const tx = await splitter.split(bob, carol, { from: alice, value });
      const log = logEvent(tx);

      expect(log.event).to.equal('LogSplit');
      expect(log.args.from).to.equal(alice);
      expect(log.args.recipient1).to.equal(bob);
      expect(log.args.recipient2).to.equal(carol);
      expect(log.args.amount.toString(10)).to.equal(
        BigNumber(value)
          .dividedToIntegerBy(2)
          .toString(10)
      );
    });

    it('should be emit LogWithdraw', async () => {
      const value = web3.toWei('0.1', 'ether');
      const tx = await splitter.split(bob, carol, { from: alice, value });
      const withdraw = await splitter.withdraw({ from: bob });

      const txLogEvent = logEvent(tx);
      expect(txLogEvent.event).to.equal('LogSplit');
      expect(txLogEvent.args.from).to.equal(alice);
      expect(txLogEvent.args.recipient1).to.equal(bob);
      expect(txLogEvent.args.recipient2).to.equal(carol);

      const withdrawLogEvent = logEvent(withdraw);
      expect(withdrawLogEvent.event).to.equal('LogWithdraw');
      expect(withdrawLogEvent.args.from).to.equal(bob);
      expect(withdrawLogEvent.args.amount.toString(10)).to.equal(
        BigNumber(value)
          .dividedToIntegerBy(2)
          .toString(10)
      );

      const contractAddress = splitter.address;
      const contractHoldEther = await pGetBalance(contractAddress);
      expect(contractHoldEther.toString(10)).to.equal(
        BigNumber(value)
          .dividedToIntegerBy(2)
          .toString(10)
      );
    });
  });
});
