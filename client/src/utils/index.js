import {ERC20_DECIMALS} from "./constants";
import BigNumber from 'bignumber.js';

// format a wallet address
export const truncateAddress = (address) => {
    if (!address) return
    return address.slice(0, 5) + "..." + address.slice(address.length - 4, address.length);
}

// convert from big number
export const formatBigNumber = (num) => {
    if (!num) return
    if (Number.isInteger(num))
        num = new BigNumber(num)
    return num.shiftedBy(-ERC20_DECIMALS).toFixed(2);
}

// convert from number to big number
export const formatNumber = (num) => {
    if (!num) return
    if (!isNaN(num))
        num = new BigNumber(num)
    return num.shiftedBy(ERC20_DECIMALS).toString();
}