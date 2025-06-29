
let web3;
let contract;
let user;

window.addEventListener("load", async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    user = accounts[0];
    contract = new web3.eth.Contract(contractABI, contractAddress);
    document.getElementById("walletStatus").innerText = "✅ Connected: " + user;
  } else {
    alert("MetaMask not detected");
  }
});

async function connectWallet() {
  await ethereum.request({ method: "eth_requestAccounts" });
}

async function stake() {
  const amount = document.getElementById("amount").value;
  const tier = document.getElementById("tierSelect").value;
  if (!amount || isNaN(amount)) return alert("Invalid amount");
  const tokenAddr = await contract.methods.token().call();
  const token = new web3.eth.Contract([{ "constant": false, "inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}], "name":"approve","outputs":[{"name":"","type":"bool"}],"type":"function"}], tokenAddr);
  const amtWei = web3.utils.toWei(amount, "ether");
  await token.methods.approve(contractAddress, amtWei).send({ from: user });
  await contract.methods.stake(amtWei, tier).send({ from: user });
  alert("✅ Stake successful");
}

async function claim() {
  await contract.methods.claimRewards().send({ from: user });
  alert("🎁 Rewards claimed");
}

async function unstake() {
  await contract.methods.unstake().send({ from: user });
  alert("🔓 Unstake complete");
}
