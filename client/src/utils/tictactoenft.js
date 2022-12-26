
export const mintNft = async (TictactoeContract, performActions, wins_count, s) => {
    var receipt_ = undefined;
    try {
        await performActions(async (kit) => {
            const { defaultAccount } = kit;
            await TictactoeContract.methods.safeMint(defaultAccount, wins_count, s.messageHash, s.signature)
                .send({ from: defaultAccount }).then(async function (receipt) {
                    receipt_ = receipt
                });
        });

    } catch (e) {
        console.log({ e });
    }

    return receipt_;
};
