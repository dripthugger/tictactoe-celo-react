//SPDX-License-Identifier: GPL-3.0
/*
    This is the main contract, it can reward user, get a deposit from user,
    get user's and contract's address and balance
*/
pragma solidity ^0.8.9;

/**
 * @title Transactions
 * @dev Implements methods to interact with user
 */
contract Transactions {
    address private owner_ = 0x205D8006383Bd92785e29DDaf398D92c65EE7020;

    struct History {
        string history_;
        uint256 timestamp;
        address opponent;
        bytes1 symbol;
    }
    
    mapping(address => History[]) public games_history;

    // Mapping of all players
    mapping(uint256 => address) public players;

    // Counter for all players
    uint256 players_count = 0;

    /**
     * @notice function to verify if signer is an owner of a contract to avoid access to a contract
     * @return bool
     */
    function verify_signer(
        bytes32 _ethSignedMessageHash,
        bytes memory _signature
    ) private view returns (bool) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        address signer = ecrecover(_ethSignedMessageHash, v, r, s);

        if (signer == owner_) {
            return true;
        }

        return false;
    }

    function splitSignature(bytes memory sig)
        private
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(sig.length == 65, "invalid signature length");

        assembly {
            /*
            First 32 bytes stores the length of the signature

            add(sig, 32) = pointer of sig + 32
            effectively, skips first 32 bytes of signature

            mload(p) loads next 32 bytes starting at the memory address p into memory
            */

            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        // implicitly return (r, s, v)
    }

    /**
     * @notice function to deposit funds from user's balance to the contract
     */
    function deposit() external payable {}

    /**
     * @notice function to withdraw(reward) funds from the contract balance to user
     * @param _to user's address
     * @param _amount withdraw funds amount
     * @param history_ string contains user's marks(X or O) to show winnings history in the profile
     * @param symbol symbol user player with (X or O)
     * @param opponent user's opponent address
     * @param _h signed message hash, needs to verify a message
     * @param _s signature hash, needs to check if user allowed to mint an nft(if transaction was signed by owner)
     */
    function withdraw(
        address payable _to,
        uint256 _amount,
        string memory history_,
        bytes1 symbol,
        address opponent,
        bytes32 _h,
        bytes memory _s
    ) external {
        require(
            verify_signer(_h, _s),
            "You are not allowed to access this contract"
        );
        require(
            address(this).balance > _amount,
            "insufficient contract balance"
        );

        // Reward user who won
        _to.transfer(_amount);

        // Write game history to players
        writeHistory(_to, history_, opponent, symbol);
    }

    /**
     * @notice function writes history of played game
     * @param _to address of a user that won a game
     * @param history_ string contains user's marks(X or O) to show winnings history in the profile
     * @param opponent address of a user who lost
     * @param symbol symbol of a user that won a game
     */
    function writeHistory(
        address _to,
        string memory history_,
        address opponent,
        bytes1 symbol
    ) internal {
        // Timestamp of a game
        uint256 time = block.timestamp * 1000;

        // Add history of a game to player who won
        games_history[_to].push(History(history_, time, opponent, symbol));

        // If it is a new player, add him to players list
        if (!isInArray(_to)) addPlayer(_to);

        // If symbol of won player is X, then opponent's is O, and vice versa
        bytes1 op_symbol = symbol == bytes1("X") ? bytes1("O") : bytes1("X");

        // Add history of a game to player who lost
        games_history[opponent].push(History(history_, time, _to, op_symbol));

        // If it is a new player, add him to players list too
        if (!isInArray(opponent)) addPlayer(opponent);
    }

    /**
     * @notice function returns games history for specific user
     * @param address_ user's address
     * @return History[] array
     */
    function getGamesHistory(address address_)
        external
        view
        returns (History[] memory)
    {
        return games_history[address_];
    }

    /**
     * @notice function adds a player to list of all players that ever played a game
     * @param member user's address
     */
    function addPlayer(address member) public {
        players[players_count] = member;

        players_count++;
    }

    /**
     * @notice function checks if user's address is already in players list
     * @param member user's address
     * @return bool
     */
    function isInArray(address member) internal view returns (bool) {
        bool doesListContainElement = false;

        for (uint256 i = 0; i < players_count; i++) {
            if (member == players[i]) {
                doesListContainElement = true;

                break;
            }
        }

        return doesListContainElement;
    }

    /**
     * @notice function return all addresses of players that played in a game
     * @notice needs to use on leaderboard page
     * @return address[]
     */
    function getAllAddreses() public view returns (address[] memory) {

        // We cannot just return a mapping, so need to create an array
        address[] memory ret = new address[](players_count);

        // Copy address of every player to a new array
        for (uint256 i = 0; i < players_count; i++) ret[i] = players[i];

        return ret;
    }

    /**
     * @notice function that shows a balance of the contract
     * @return uint
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice function returns a contract address
     * @return address
     */
    function getAddress() external view returns (address) {
        return address(this);
    }

    /**
     * @notice function returns user's address
     * @return address
     */
    function getUserAddress() external view returns (address) {
        return msg.sender;
    }
}
