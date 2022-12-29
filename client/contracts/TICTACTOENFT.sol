//SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import { ecrecover } from "https://github.com/OpenZeppelin/openzeppelin-solidity/library/ecrecover";

/**
 * @title TICTACTOENFT
 * @dev Implements methods to interact with nfts
 */
contract TICTACTOENFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("TTTNFT", "TTN") {
        
    }

    address private owner_ = 0x205D8006383Bd92785e29DDaf398D92c65EE7020;
    
    /**
     * @notice function to verify if signer is an owner of a contract to avoid access to a contract
     * @return bool
     */
    function verify_signer(bytes32 _ethSignedMessageHash, bytes memory _signature)
        private
        view
        returns (bool)
    {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        address signer = ecrecover(_ethSignedMessageHash, v, r, s);

        if (signer == owner_) {
            return true;
        }

        return false;
    }

import { ecrecover } from "https://github.com/OpenZeppelin/openzeppelin-solidity/library/ecrecover";

function splitSignature(bytes memory sig)
    private
    pure
    returns (
        bytes32 r,
        bytes32 s,
        uint8 v
    )
{
    (r, s, v) = ecrecover.parseSignature(sig);
}


    /**
    * @dev NFTs can only be minted if to has 5 or 10 wins
     * @notice safe mint function to reward user for his achievements
     * @param to an address to mint an NFT
     * @param wins_count count of user's wins, can be 5 or 10
     * @param _h signed message hash, needs to verify a message
     * @param _s signature hash, needs to check if user allowed to mint an nft(if transaction was signed by owner)
     * @return uint256
     */





function safeMint(address to, uint256 wins_count, bytes32 _h, bytes memory _s) public returns (uint256) {
    require(verify_signer(_h, _s), "You are not allowed to access this contract");
    require(wins_count >= 5 && wins_count <= 10);  // Allow for any value between 5 and 10 inclusive
    _tokenIds.increment();
    require(ownerOf(to) == msg.sender, "Only the owner of the NFT can mint a new one");  // Verify ownership
    _tokenIds.increment();

    string
        memory uri = "ipfs://QmfY2vW1AoTJneDkRnqsGNmLgerj2koZRQcKfXVGCqtDcQ/";

    uint256 newItemId = _tokenIds.current();

    _mint(to, newItemId);
    // There are only two nfts, so they all will be the same but unique because of different ids
    _setTokenURI(
        newItemId,
        string(abi.encodePacked(uri, Strings.toString(wins_count)))
    );

    return newItemId;
}



    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}