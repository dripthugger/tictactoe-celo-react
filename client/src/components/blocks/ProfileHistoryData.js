import { loadUserWins, loadUserWinsHashes } from "../../utils/serverapi";
import { useState, useEffect, useCallback } from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
import { Row } from "react-bootstrap";
import Loader from "../ui/Loader";
import WinCard from './WinCard'


/*
    Block in the profile page, provides a game history,
    renders as blocks of cells
*/
const ProfileHistoryData = ({ TransactionsContract }) => {
    const { address } = useContractKit();
    const [loading, setLoading] = useState(true);

    const { getConnectedKit } = useContractKit();

    const [wins_, setWins] = useState([]);

    const loadWins = useCallback(async (address) => {
        // Returns an array with blockchain hashes from the server
        const wins_hashes = await loadUserWinsHashes(address)

        // Creating of a kit component, needs to use in the utils/serverapi
        const kit = await getConnectedKit();

        let wins_history = []
        if (wins_hashes.length)
            wins_history = await loadUserWins(wins_hashes, kit);

        setWins(wins_history)
    }, [getConnectedKit, setWins])

    useEffect(() => {
        loadWins(address);

        setLoading(false);
    }, [address, loadWins]);

    return (
        <>
            {!loading
                ?

                wins_.length ?
                    <Row className="justify-content-center" style={{ marginTop: "2em" }}>
                        <h2 className="text-center">Your wins history (<span id="wins_count">{wins_.length}</span>)</h2>
                        <div id="wins_history game-page">
                            {wins_.map((element, key) => (
                                <WinCard element={element} key={key} mkey={key} />
                            ))}
                        </div>
                    </Row>
                    :
                    <div className="text-center" style={{marginTop:"1em"}}><h3>You do not have wins at this moment</h3></div>

                :
                <Loader />
            }
        </>
    );
}

export default ProfileHistoryData;