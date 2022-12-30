import axios from 'axios';
import { server_domain } from './constants'

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