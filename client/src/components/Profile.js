import { useLayoutEffect } from "react";
import ProfileContractData from './blocks/ProfileContractData';
import ProfileAchievements from './blocks/ProfileAchievements'
import ProfileHistoryData from './blocks/ProfileHistoryData'

const Profile = ({ address, hextoutf8, socket, TransactionsContract, TictactoeContract, updateBalance }) => {

    useLayoutEffect(() => {
        socket.disconnect();
    }, [socket])
    
    return (
        <>
            <ProfileContractData updateBalance={updateBalance} TransactionsContract={TransactionsContract} />

            <ProfileAchievements hextoutf8={hextoutf8} TictactoeContract={TictactoeContract} TransactionsContract={TransactionsContract}/>

            <ProfileHistoryData hextoutf8={hextoutf8} address={address} TransactionsContract={TransactionsContract} />
        </>
    );
}

export default Profile;