import React, { Fragment, Component } from 'react';
import Eth from 'ethjs';
import SplitterContext from './contexts/SplitterContext';
import Header from './components/Header';
import CharacterList from './components/CharacterList';
import SendBalance from './components/SendBalance';
import Footer from './components/Footer';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './constants';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eth: {},
      splitter: {},
      contractBalance: 0,
      characters: [],
      amount: 0,
      unit: 'wei'
    };
    this.amountInput = React.createRef();
  }

  componentDidMount() {
    const testRPC = new Eth.HttpProvider('http://localhost:8545');
    const eth = new Eth(testRPC);
    const splitter = eth.contract(CONTRACT_ABI).at(CONTRACT_ADDRESS);

    this.setState({ eth, splitter });
    this.checkWeb3Interval = setInterval(async () => {
      const { eth } = this.state;

      try {
        const accounts = await eth.accounts();
        const characters = await this.fetchBalance(accounts.slice(0, 3));
        const contractBalance = await eth.getBalance(splitter.address);

        this.setState({
          characters,
          contractBalance: Eth.fromWei(contractBalance, 'ether')
        });
      } catch (err) {
        console.error(err);
      }
    }, 1500);
  }

  componentwillunmount() {
    clearInterval(this.checkWeb3Interval);
  }

  setAmount = event => {
    const amount = parseInt(event.target.value);

    this.setState(previousState => ({ ...previousState, amount }));
  };

  setUnit = event => {
    const type = ['wei', 'ether'];
    const unit = event.target.value;

    if (type.includes(unit)) {
      this.setState(previousState => ({ ...previousState, unit }));
    }

    return;
  };

  split = () => {
    const { amount, unit, characters, splitter } = this.state;
    const [alice, bob, carol] = characters;

    splitter
      .split(bob.address, carol.address, {
        from: alice.address,
        value: Eth.toWei(amount, unit)
      })
      .then(() => {
        this.amountInput.current.value = '';
        this.setState({ amount: 0 });
      })
      .catch(console.error);
  };

  withdraw = address => {
    this.state.splitter
      .withdraw({ from: address })
      .then(console.log)
      .catch(console.error);
  };

  fetchBalance(characters) {
    const { eth } = this.state;
    const names = ['Alice', 'Bob', 'Carol'];
    const charactersInformation = characters.map(async (address, index) => {
      const balance = await eth.getBalance(address);

      return {
        name: names[index],
        address,
        balance: Eth.fromWei(balance, 'ether')
      };
    });

    return Promise.all(charactersInformation);
  }

  render() {
    const { characters } = this.state;

    return (
      <Fragment>
        <Header />
        <div className="container mt-2">
          <CharacterList
            characters={characters}
            withdraw={this.withdraw}
          />
          <SplitterContext.Provider
            value={{
              state: this.state,
              split: this.split,
              setAmount: this.setAmount,
              setUnit: this.setUnit,
              amountInput: this.amountInput
            }}
          >
            <SendBalance />
          </SplitterContext.Provider>
          <Footer />
        </div>
      </Fragment>
    );
  }
}

export default App;
