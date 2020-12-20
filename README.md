# CryptoTicketing

A Blockchain based DApp for E-ticketing

## How to get started

### Prerequisites

1. Install Node (12.18.4) and npm (6.14.6)
2. MetaMask extension for browser ([Link](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en))
3. Install Ganache ([Link](https://www.trufflesuite.com/ganache))
4. Install IPFS ([Link](https://github.com/ipfs-shipyard/ipfs-desktop))
5. <https://docs.ipfs.io/install/>
6. <https://github.com/INFURA/tutorials/wiki/IPFS-and-CORS>
Run the following commands in Terminal

### Install Truffle Framework

```bash
npm install -g truffle
npm install -g create-react-app
```

Some Commands for truffle

```bash
Commands:

  start develop env     truffle develop
  Compile:              truffle compile --network networkName
  Migrate:              truffle migrate --network networkName
  Test contracts:       truffle test
  Test dapp:            cd client && npm test
  Run dev server:       cd client && npm run start
  Build for production: cd client && npm run build
```

### Sequence to run commands

Develop ---> compile ---> migarte ---> run Dapp

### Before running app configure Ganache and Metamask

1. Create a new Workspace in Ganache GUI

2. Add truffle-config.js file to the project and save the workspace

3. Go to browser and open metamask extension

4. Create a new wallet

5. Go to settings add a local network if not available

6. Create a new account in the network using one of the private key obtained from truffle

Now we are ready to go!
