import { useLayoutEffect } from "react";
import ProfileContractData from './blocks/ProfileContractData';
import ProfileAchievements from './blocks/ProfileAchievements'
import ProfileHistoryData from './blocks/ProfileHistoryData'

const Profile = ({ socket, TransactionsContract, TictactoeContract, updateBalance }) => {

    useLayoutEffect(() => {
        socket.disconnect();
        console.log(socket)
    }, [socket])
    
    return (
        <>
            <ProfileContractData updateBalance={updateBalance} TransactionsContract={TransactionsContract} />

            <ProfileAchievements TictactoeContract={TictactoeContract} />

            <ProfileHistoryData TransactionsContract={TransactionsContract} />
        </>
    );
}

export default Profile;