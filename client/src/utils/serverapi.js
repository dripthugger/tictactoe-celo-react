import axios from 'axios';
import { server_domain } from './constants'

export const writeUserWin = async (address, txhash) => {
    try {
        await axios.get(`${server_domain}/save_tx/?address=${address}&txhash=${txhash}`);
    } catch (e) {
        console.log({ e });
    }
};

export const loadUserWinsHashes = async (address) => {
    var wins_ = [];
    try {
        await axios.get(`${server_domain}/winner_hashes/?address=${address.toLowerCase()}`)
            .then(res => {
                if(res.data.result.length)
                    wins_ = JSON.parse(res.data.result).reverse();  
            });
    } catch (e) {
        console.log({ e });
    }
    return wins_;
};

export const loadUserWins = async (hashes, kit) => {

    var wins_history = [];

    for (let element of hashes) {

        let res = await axios.get(`https://explorer.celo.org/alfajores/api?module=transaction&action=gettxinfo&txhash=${element}`)
            .then(function (res) {
                let obj = res.data.result,
                    game_result = ((kit.web3.utils.toAscii(obj.input)).match(".*([O|X][O|E|X]{9}).*")[1])

                return {
                    'hash': obj.hash,
                    'timestamp': obj.timeStamp,
                    'result': game_result
                }
            })
            .catch(function (error) {
                console.log(error);
            });

        wins_history.push(res)
    }

    return wins_history;
};

export const loadMintednft = async (address) => {
    return await axios.get(`${server_domain}/minted?address=${address}`)
        .then(function (res) {
            return res.data.result.length ? res.data.result : {};
        })
        .catch(function (error) {
            console.log(error);
        });
}

export const saveMintedNftData = async (address, val, ntf_token_id) => {
    await axios.get(`${server_domain}/save_mint/?address=${address}&wins_count=${val}&token_id=${ntf_token_id}`)
}