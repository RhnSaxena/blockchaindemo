import React, { Component } from "react";
import { BrowserRouter as Router, NavLink } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import SponsorAdvertising from "./contracts/SponsorAdvertising.json";
import getWeb3 from "./getWeb3";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import Header from "./components/header/Header";
import SideBar from "./components/sidebar/SideBar";
import MainContent from "./components/mainContent/MainContent";

import "./App.css";

class App extends Component {
  //
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      accounts: null,
      contract: null,
      menuOpen: false,
      isApproved: false,
      isOwner: false,
    };
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      const deployedNetwork = SponsorAdvertising.networks[networkId];

      const SponsorAdvertisingInstance = new web3.eth.Contract(
        SponsorAdvertising.abi,
        deployedNetwork && deployedNetwork.address
      );

      // const SponsorAdvertisingtInstance = new web3.eth.Contract(
      //   EventTicketContract.abi,
      //   deployedNetwork && deployedNetwork.address
      // );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.

      // var res = await EventInstance.methods.isApproved(accounts[0]).call();
      this.setState(
        {
          web3,
          accounts,
          contract: { SponsorAdvertising: SponsorAdvertisingInstance },
          isApproved: "res",
          // isApproved: res,
        },
        this.runExample
      );
      // res = await SponsorAdvertisingInstance.methods.owner().call();
      // console.log(res);
      // if (accounts[0] === res) {
      //   this.setState({ isOwner: true });
      // }
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  toggleMenu = () => {
    if (window.outerWidth > 600) return;
    var newState = !this.state.menuOpen;
    this.setState({ menuOpen: newState });

    var sidebar = document.getElementsByClassName("sideBar")[0];
    if (!this.state.menuOpen) {
      sidebar.style.display = "flex";
    } else {
      sidebar.style.display = "none";
    }
  };

  closeMenu = () => {
    this.setState({ menuOpen: false });
  };

  runExample = async () => {
    // const { accounts, contract } = this.state;
    // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });
    // // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();
    // Update state with the result.
  };

  render() {
    if (!this.state.web3) {
      return (
        <div className="App App-header">
          Loading Web3, accounts, and contract...
          <Loader
            type="TailSpin"
            color="#8D3B72"
            height={100}
            width={100}
            // timeout={6000}
          />
        </div>
      );
    }
    return (
      <Router>
        <ToastProvider>
          <div className="App">
            <Header
              open={this.state.menuOpen}
              toggleMenu={this.toggleMenu}
            ></Header>
            {!this.state.isApproved && !this.state.isOwner && (
              <div className="notApproved">
                Not Approved. Click <NavLink to="/getApproval">here </NavLink>to
                apply for approval.
              </div>
            )}
            <SideBar
              open={this.state.menuOpen}
              toggleMenu={this.toggleMenu}
              isOwner={this.state.isOwner}
            ></SideBar>
            <MainContent
              bc={{
                accounts: this.state.accounts,
                contracts: this.state.contract,
              }}
            ></MainContent>
          </div>
        </ToastProvider>
      </Router>
    );
  }
}

export default App;
