import logo from "./logo.svg";
import "./App.css";
import React from "react";
import web3 from './web3';
import lottery from "./lottery";


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { manager: '', players: [], balance: '', value: '', message: '' }
  }

  async componentDidMount() {
    // 使用matemask时，不需要使用from指定用户
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    console.log(players)

    this.setState({
      manager,
      players,
      balance
    })
  }

  onClick = async (event) => {
    const accounts = await web3.eth.getAccounts();

    this.setState({
      message: 'Waiting on transaction success...'
    })

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    })

    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({
      message: 'A winner has been picked!',
      balance
    })
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({
      message: 'Waiting on transaction success...'
    })

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    })

    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({
      message: 'You have benn entered!',
      balance
    })
  }

  render() {
    console.log(web3.version);
    web3.eth.getAccounts().then(console.log);


    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by <b>{this.state.manager}</b></p>
        <p>There are currently <b>{this.state.players.length}</b> people entered competing to </p>
        <p>Win <b>{web3.utils.fromWei(this.state.balance, 'ether')}</b> ether </p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your lunk?</h4>
          <div>
            <label>Amount of ehter to enter </label>
            <input
              value={this.state.value}
              onChange={(event) => {
                this.setState({ value: event.target.value })
              }}
            ></input>
          </div>
          <button>Enter</button>
        </form>

        <hr />

        <h4>Ready to pick a winner?</h4>
        <button
          onClick={this.onClick}
        >Pick a winner!</button>
        <hr />

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;