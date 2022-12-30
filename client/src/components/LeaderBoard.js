import { useLayoutEffect, useEffect, useCallback, useState } from "react";
import { getAllAddresses, getGamesHistory } from "../utils/transactions";
import { Alert } from "react-bootstrap"
import Loader from "./ui/Loader";

const LeaderBoard = ({ hextoutf8, socket, TransactionsContract }) => {

    const [loading, setLoading] = useState(true);

    const [leaderboard, setLeaderBoard] = useState([]);

    const loadAllAddresses = useCallback(async () => {

        if (TransactionsContract) {
            let board = [];

            // Array of all players
            const ad = await getAllAddresses(TransactionsContract);

            for (var i = 0; i < ad.length; i++) {

                // All games history for every player
                const data = await getGamesHistory(TransactionsContract, ad[i]);

                // Counters for user's wins and looses
                let wins = 0, looses = 0;

                // Loop every game to increment user's wins or looses
                for (var j = 0; j < data.length; j++) {
                    if (hextoutf8(data[j].symbol) === data[j].history_[0])
                        wins++;
                    else
                        looses++;
                }

                board.push({
                    address: ad[i],
                    wins,
                    looses,
                    ratio: wins - looses
                });

            }

            board.sort(function (x, y) {
                return y.ratio - x.ratio;
            });

            setLeaderBoard(board)
        }
    }, [TransactionsContract, hextoutf8]);

    useLayoutEffect(() => {
        socket.disconnect();
    }, [socket]);

    useEffect(() => {

        loadAllAddresses();

        setLoading(false);
    }, [loadAllAddresses]);

    return (
        <>
            {!loading ?
                <>

                    {leaderboard.map((element, index) => {
                        return (<Alert variant={index === 0 ? "warning" : index === 1 ? "secondary" : "light"} key={index}>
                            {element.address}, {element.wins} wins, {element.looses} looses
                        </Alert>)
                    })}

                </>
                :
                <Loader />
            }
        </>
    );
};

export default LeaderBoard;
