export const getAddress = async (transactionsContract) => {
    try {
        const value = await transactionsContract.methods.getAddress().call();
        return value
    } catch (e) {
        console.log({ e });
    }
};

export const getBalance = async (transactionsContract) => {
    try {
        const value = await transactionsContract.methods.getBalance().call();
        return value
    } catch (e) {
        console.log({ e });
    }
};

export const depositToContract = async (transactionsContract, performActions, amount) => {
    try {
        await performActions(async (kit) => {
            const { defaultAccount } = kit;
            await transactionsContract.methods.deposit().send({ from: defaultAccount, value: amount });
        });
    } catch (e) {
        console.log({ e });
    }
};

export const getGamesHistory = async (transactionsContract, address) => {
    var result_ = undefined;
    if (typeof address === "string") {
        try {
            result_ = await transactionsContract.methods.getGamesHistory(address).call();

        } catch (e) {
            console.log({ e });
        }
    }

    return result_;
};

export const getReward = async (transactionsContract, performActions, amount, history, symbol, opponent, s) => {
    var receipt_ = undefined;
    try {
        await performActions(async (kit) => {
            const { defaultAccount } = kit;
            await transactionsContract.methods.withdraw(defaultAccount, amount.toString(), history, kit.web3.utils.asciiToHex(symbol), opponent, s.messageHash, s.signature)
                .send({ from: defaultAccount }).then(async function (receipt) {
                    receipt_ = receipt
                });
        });

    } catch (e) {
        console.log({ e });
    }

    return receipt_;
};

export const getAllAddresses = async (transactionsContract) => {
    var result_ = undefined;
    try {

        result_ = await transactionsContract.methods.getAllAddreses().call();

    } catch (e) {
        console.log({ e });
    }

    return result_;
};