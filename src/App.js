import React,{Component} from "react";
import lottery from "./lottery";
import web3 from "./web3";

export default class App extends Component{
  state={
    manager:"",
    players:[0],
    balance:"",
    value:"",
    message:"",
  };
  async componentDidMount(){
    const manager=await lottery.methods.manager().call();
    const players=await lottery.methods.getPlayers().call();
    const balance=await web3.eth.getBalance(lottery.options.address);
    console.log("manager",manager);
     console.log("players",players);
    console.log("balance",balance);
    this.setState({manager:manager,balance:balance})
  }
  onSubmit=async (event)=>{
    event.preventDefault();
    const accounts=await web3.eth.getAccounts();
    this.setState({message:'waiting on the transaction'});
    await lottery.methods.enter().send({
      from:accounts[0],
      value:web3.utils.toWei(this.state.value,'ether'),
    });
    this.state({message:'You have entered'});
  };
  onClick=async()=>{
    const accounts=await web3.eth.getAccounts();
    this.setState({message:"waiting transaction to success"});
    await lottery.methods.pickwinner().send({
      from:accounts[0]
    })
    this.setState({message:'A winner has been picked'});
  }
  render(){
return (
  <div>
    <h2>Lottery Contract</h2>
    <p>This Contract is managed by {this.state.manager}
    <br/>There are currently {this.state.players.length} people enter compiting to win {web3.utils.fromWei(this.state.balance,'ether')} {" "}ether!
    </p>
    <hr/>
    <form onSubmit={this.onSubmit}>
      <h4>want to try your luck?</h4>
      <div>
        <label>
          Amount of ether to enter
        </label>
        <input
        value={this.state.value}
        onChange={(event)=>this.setState({value:event.target.value})}
        />
      </div>
      <button>enter</button>
    </form>
    <hr/>
    <h4>ready to pick a winner</h4>
    <button onClick={this.onClick}>pick a winner</button>
    <hr/>
    <h1>{this.state.message}</h1>
  </div>
);

  }

}