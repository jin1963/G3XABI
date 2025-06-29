let web3;
let contract;
let userAccount;
const contractAddress = "0x2553674aE4ff730056DaA445Bf4e7d26cA31335A";

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await ethereum.request({ method: "eth_requestAccounts" });
            const accounts = await web3.eth.getAccounts();
            userAccount = accounts[0];
            document.getElementById("walletStatus").innerText = "✅ Connected: " + userAccount;

            contract = new web3.eth.Contract(contractABI, contractAddress);
        } catch (err) {
            console.error("Wallet connect error:", err);
        }
    } else {
        alert("Please install MetaMask.");
    }
}

document.getElementById("connectWalletBtn").onclick = connectWallet;

document.getElementById("stakeBtn").onclick = async () => {
    if (!contract || !userAccount) return alert("Connect wallet first.");

    const amount = document.getElementById("amount").value;
    const tier = document.getElementById("tierSelect").value;

    if (!amount || isNaN(amount) || amount <= 0) {
        return alert("Enter valid amount.");
    }

    try {
        const tokenAddress = await contract.methods.token().call();
        const tokenContract = new web3.eth.Contract([
            { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "", "type": "bool" } ], "type": "function" }
        ], tokenAddress);

        const stakeAmount = web3.utils.toWei(amount, "ether");

        await tokenContract.methods.approve(contractAddress, stakeAmount).send({ from: userAccount });
        await contract.methods.stake(stakeAmount, tier).send({ from: userAccount });

        alert(`✅ Staked ${amount} G3X for ${tier} days.`);
    } catch (err) {
        console.error(err);
        alert("❌ Stake failed.");
    }
};

document.getElementById("claimBtn").onclick = async () => {
    if (!contract || !userAccount) return alert("Connect wallet first.");
    try {
        await contract.methods.claimRewards().send({ from: userAccount });
        alert("✅ Rewards Claimed.");
    } catch (err) {
        console.error(err);
        alert("❌ Claim failed.");
    }
};

document.getElementById("unstakeBtn").onclick = async () => {
    if (!contract || !userAccount) return alert("Connect wallet first.");
    try {
        await contract.methods.unstake().send({ from: userAccount });
        alert("✅ Unstaked.");
    } catch (err) {
        console.error(err);
        alert("❌ Unstake failed.");
    }
};
