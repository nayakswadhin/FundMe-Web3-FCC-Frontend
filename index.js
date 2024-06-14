import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js"
import { abi, contactAddress } from "./constants.js"

const connectButton = document.getElementById("connectbtn")
const fundButton = document.getElementById("fundbtn")
const getBalanceBtn = document.getElementById("getBalance")
const withdrawBtn = document.getElementById("withdrawBtn")
connectButton.onclick = connect
fundButton.onclick = fund
getBalanceBtn.onclick = getBalance
withdrawBtn.onclick = withdraw

console.log(ethers)
async function connect() {
  if (typeof window.ethereum !== undefined) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" })
    } catch (error) {
      console.log(error)
    }
    connectButton.innerHTML = "Connected"
    const accounts = await window.ethereum.request({ method: "eth_accounts" })
    console.log("Successfully Connected")
    console.log(accounts)
  } else {
    console.log("No Metamask!!")
    connectButton.innerHTML = "Please install Metamask"
  }
}
async function fund() {
  const ethAmount = document.getElementById("ethAmount").value
  if (typeof window.ethereum !== undefined) {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contactAddress, abi, signer)
    try {
      const transactionResponse = await contract.fund({
        value: ethers.parseEther(ethAmount),
      })
      await listenForTransactionMine(transactionResponse, provider)
      console.log("Done!!")
    } catch (error) {
      console.log(error)
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log("Mining " + transactionResponse.hash)
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, async (transactionReceipt) => {
      const confirmations = await transactionReceipt.confirmations(1)
      console.log(transactionReceipt)
      resolve()
    })
  })
}

async function getBalance() {
  if (typeof window.ethereum !== undefined) {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const balance = await provider.getBalance(contactAddress)
    console.log(ethers.formatEther(balance))
  }
}

//Withdraw

async function withdraw() {
  if (typeof window.ethereum !== undefined) {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contactAddress, abi, signer)
    try {
      const transactionResponse = await contract.withdraw()
      console.log(transactionResponse)
      await listenForTransactionMine(transactionResponse, provider)
      console.log("Done!!")
    } catch (error) {
      console.log(error)
    }
  }
}
