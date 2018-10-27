export const CONTRACT_ADDRESS = '';
export const CONTRACT_ABI = [
  {
    constant: false,
    inputs: [
      {
        name: 'first',
        type: 'address'
      },
      {
        name: 'second',
        type: 'address'
      }
    ],
    name: 'split',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    name: 'balances',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'withdraw',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: 'recipient1',
        type: 'address'
      },
      {
        name: 'recipient2',
        type: 'address'
      }
    ],
    name: 'areAcceptable',
    outputs: [
      {
        name: 'isAcceptable',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address'
      },
      {
        indexed: true,
        name: 'recipient1',
        type: 'address'
      },
      {
        indexed: true,
        name: 'recipient2',
        type: 'address'
      },
      {
        indexed: false,
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'LogSplit',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address'
      },
      {
        indexed: false,
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'LogWithdraw',
    type: 'event'
  }
];
