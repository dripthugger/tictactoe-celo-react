import { useState, useEffect, useCallback } from "react";
import { getGamesHistory } from "../../utils/transactions";
import { Button, Row } from "react-bootstrap";
import Loader from "../ui/Loader";
import GameHistoryCard from './GameHistoryCard'

/*
    Block in the profile page, provides a game history,
    renders as blocks of cells
*/
const ProfileHistoryData = ({ hextoutf8, address, TransactionsContract }) => {

    const [loading, setLoading] = useState(true);

    // Games history array to be showed to user
    const [gamesToRender, setGamesToRender] = useState([]);

    // Array for won games
    const [wins_, setWins] = useState([]);

    // Array for lost games
    const [looses_, setLooses] = useState([]);

    // Array for all user's games
    const [all_history, setAllHistory] = useState([]);

    // Variable cotains current filter, all | won | lost
    const [active_filter, setFilter] = useState("all");

    const loadWins = useCallback(async () => {

        if (TransactionsContract) {
            const games_history = (await getGamesHistory(TransactionsContract, address));

            // games_history is read-only, so we need to create another array for all games
            let all_games = [], wins_ = [], looses = [];

            games_history.forEach(element => {

                // We can reverse each array to get sorted by date or just use unshift

                if (element.history_[0] === hextoutf8(element.symbol))
                    wins_.unshift(element)
                else
                    looses.unshift(element)
                all_games.unshift(element);
            })

            setAllHistory(all_games);

            setWins(wins_);

            setLooses(looses);

            // Set current games to render to all games
            setGamesToRender(all_games);
        }

    }, [TransactionsContract, address, setWins, hextoutf8]);

    const changeFilter = (active) => {

        if (active !== active_filter) {
            setFilter(active);

            if (active === "won")
                setGamesToRender(wins_);
            else if (active === "lost")
                setGamesToRender(looses_);
            else
                setGamesToRender(all_history);
        }

    }

    useEffect(() => {
        loadWins();

        setLoading(false);

    }, [loadWins]);

    return (
        <>
            {!loading ?
                <Row className="justify-content-center" style={{ marginTop: "2em" }}>
                    <h2 className="text-center">
                        Your {active_filter === "won" ? "won" : active_filter === "lost" && "lost" }{' '} games history
                        (<span id="wins_count">{gamesToRender.length}</span>)
                    </h2>
                    <div>
                        <Button size="md" onClick={() => changeFilter('all')} active={active_filter === "all" || false} variant="light" style={{ margin: "0 0.5em" }}>All</Button>
                        <Button size="md" onClick={() => changeFilter('won')} active={active_filter === "won" || false} variant="light" style={{ margin: "0 0.5em" }}>Won</Button>
                        <Button size="md" onClick={() => changeFilter('lost')} active={active_filter === "lost" || false} variant="light" style={{ margin: "0 0.5em" }}>Lost</Button>
                    </div>
                    {gamesToRender.length ?
                        <div id="wins_history game-page">
                            {gamesToRender.map((element, key) => (
                                <GameHistoryCard symbol={hextoutf8(element.symbol)} element={element} key={key} mkey={key} />
                            ))}
                        </div>
                        :
                        <div className="text-center" style={{ marginTop: "1em" }}>
                            <h3>You do not have{' '}
                                {active_filter === "all" ? "game history" : active_filter === "won" ? "winnings" : "lost games"}{' '}
                                at this moment</h3>
                        </div>
                    }
                </Row>
                :
                <Loader />
            }
        </>
    );
}

export default ProfileHistoryData;