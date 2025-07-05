import Web3 from "web3";
import abi from "..abi.json";

const web3 = new Web3(window.ethereum); // or your provider
const address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Your latest deployed contract

const contract = new web3.eth.Contract(abi, address);

export default contract;