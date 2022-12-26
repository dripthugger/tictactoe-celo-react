import { useContractKit } from "@celo-tools/use-contractkit";
import * as dotenv from 'dotenv'
dotenv.config()

export const useSignature = (message) => {
    const { kit } = useContractKit();

    try {
        const sign = kit.web3.eth.accounts.sign(message, process.env.REACT_APP_PRIVATE_KEY);

        return sign;
    } catch (e) {
        console.log({ e });
    }

};
