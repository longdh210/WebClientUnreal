const Web3 = require('web3');
const contractAddress = "0xeDD7E71C698922B88FD43825AAa1b7171934d0B6";
const abi = require('./abi.json');

const web3Ether = new Web3("wss://subnets.avax.network/wagmi/wagmi-chain-testnet/ws");

const contract = new web3Ether.eth.Contract(abi, contractAddress);

contract.events.Transfer({}, function(error, event) {
    console.log("error", error);
    console.log("event", event);
}).on("data", async (event) => {
    console.log(event);

    // Get data
    let { from, to, tokenId } = event.returnValues;
    
    console.log("from:", from);
    console.log("to:", to);
    console.log("tokenId:", tokenId);
})