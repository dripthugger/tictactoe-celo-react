import { loadMintednft, saveMintedNftData } from "../../utils/serverapi";
import { getGamesHistory } from "../../utils/transactions";
import { useContractKit } from "@celo-tools/use-contractkit";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useState, useEffect, useCallback } from "react";
import { mintNft } from "../../utils/tictactoenft";
import { useSignature } from "../../hooks";
import Loader from "../ui/Loader";

/* Functional component that show nft achievements to the user,
    if user has enough wins, nft can be minted
*/
const ProfileAchievements = ({ hextoutf8, TictactoeContract, TransactionsContract }) => {

    const { address, performActions } = useContractKit();

    const [loading, setLoading] = useState(true);

    // Object of already minted nft achievements by the user
    const [mintedNft, setmintedNft] = useState({});

    // Count of user's wins
    const [wins_count, setWinsCount] = useState(0);

    const signature = useSignature("");

    const loadAchievements = useCallback(async (address) => {

        // Count of user's winnings

        let wins_count = 0;
        if (TransactionsContract) {
            const games_history = await getGamesHistory(TransactionsContract, address);

            // Need to iterate each game to calculate if user won
            games_history.forEach(element => {
                if (element.history_[0] === hextoutf8(element.symbol))
                    wins_count++
            })

            setWinsCount(wins_count)

            setmintedNft(await loadMintednft(address));
        }

    }, [TransactionsContract, hextoutf8]);

    useEffect(() => {
        loadAchievements(address);

        setLoading(false);
    }, [address, loadAchievements]);

    /* Render button on every achievement
        Button can be claim(active), claimed(inactive) and need more wins(inactive)
    */
    const loadButton = (wins) => {
        let button;
        if (wins_count >= wins) {
            if (mintedNft[wins] === undefined)
                button = <Button variant="primary" onClick={() => claimNft(5)}>Claim</Button>
            else
                button = <Button variant="dark" disabled>Claimed</Button>
        } else {
            button = <Button variant="light" disabled>Need more wins</Button>
        }

        return button;
    }

    const claimNft = async (val) => {

        // Save a receipt of the transaction
        const receipt = await mintNft(TictactoeContract, performActions, val, signature);

        if (receipt !== undefined) {
            let ntf_token_id = receipt.events.Transfer.returnValues.tokenId;
            await saveMintedNftData(address, val, ntf_token_id);

            loadAchievements(address);
        }
    }

    return (
        <div>
            {!loading
                ?
                <Row className="justify-content-center">
                    <h2 className="text-center" style={{ marginTop: "1em" }}>Claim your NFT for achievements</h2>
                    <Col md="12" className="align-self-center" style={{ paddingTop: "2em" }}>
                        <Card style={{ width: "18rem", display: "inline-block", margin: "0 1em" }}>
                            <Card.Img variant="top" src="https://gateway.pinata.cloud/ipfs/QmaUxVoA4MSUmsnDeH3WEgNAotAoMgGAr6B6CTxYtEg4TZ" />
                            <Card.Body>
                                <Card.Title>5 Wins</Card.Title>

                                {loadButton(5)}

                            </Card.Body>
                        </Card>
                        <Card style={{ width: "18rem", display: "inline-block" }}>
                            <Card.Img variant="top" src="https://gateway.pinata.cloud/ipfs/QmcTAqeaxXgx3PbzuvdZM8GnXMC45CWaUDZkiEtTHbF5tk" />
                            <Card.Body>
                                <Card.Title>10 Wins</Card.Title>

                                {loadButton(10)}

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                :
                <Loader />
            }
        </div>
    )
}

export default ProfileAchievements;