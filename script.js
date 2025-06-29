let web3;
let contract;
let userAccount;

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
    const amount = document.getElementById("amount").value;
    const tier = document.getElementById("tierSelect").value;

    if (!amount || isNaN(amount) || amount <= 0) {
        alert("Enter valid G3X amount.");
        return;
    }

    const stakeAmount = web3.utils.toWei(amount, "ether");

    try {
        const tokenAddress = await contract.methods.token().call();
        const tokenContract = new web3.eth.Contract([
            {"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"type":"function"}
        ], tokenAddress);

        await tokenContract.methods.approve(contractAddress, stakeAmount).send({ from: userAccount });
        await contract.methods.stake(stakeAmount, tier).send({ from: userAccount });

        alert(`✅ Staked ${amount} G3X for ${tier} days.`);
    } catch (err) {
        console.error("Stake error:", err);
        alert("❌ Stake failed. See console.");
    }
};

document.getElementById("claimBtn").onclick = async () => {
    try {
        await contract.methods.claimRewards().send({ from: userAccount });
        alert("✅ Reward Claimed.");
    } catch (err) {
        console.error("Claim error:", err);
        alert("❌ Claim failed.");
    }
};

document.getElementById("unstakeBtn").onclick = async () => {
    try {
        await contract.methods.unstake().send({ from: userAccount });
        alert("✅ Unstaked successfully.");
    } catch (err) {
        console.error("Unstake error:", err);
        alert("❌ Unstake failed.");
    }
};
