import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
import { getReward } from "../utils/transactions";
import { formatNumber } from "../utils";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { useSignature } from "../hooks";
import Loader from "./ui/Loader";
import "./styles/Game.css";

const Game = ({ address, socket, TransactionsContract, updateBalance }) => {
    const [loading, setLoading] = useState(true);

    // Cells instance, needs for calculating if user wins or loses
    const [cells, setCells] = useState({
        a0: "",
        a1: "",
        a2: "",

        b0: "",
        b1: "",
        b2: "",

        c0: "",
        c1: "",
        c2: ""
    });

    // Signature for contract calls
    const signature = useSignature("");

    const { performActions } = useContractKit();

    // Is cells are disabled(if it is not user's turn)
    const [disabled, setDisabled] = useState(true)

    let myTurn = useRef(null),
        symbol = useRef(null),
        rewarded = useRef(null);

    const [message, setMessage] = useState("Waiting for opponent to join...");

    const play_again_button = "<button class='btn btn-light' onclick='window.location.href = window.location.href'>Play again</button>";

    // We are using a useCallback to avoid multiple rendering
    const isGameOver = useCallback(() => {
        var state = getBoardState(),
            // One of the rows must be equal to either of these value for the game to be over
            matches = ["XXX", "OOO"],
            // These are all of the possible combinations that would win the game
            rows = [
                state.a0 + state.a1 + state.a2,
                state.b0 + state.b1 + state.b2,
                state.c0 + state.c1 + state.c2,
                state.a0 + state.b1 + state.c2,
                state.a2 + state.b1 + state.c0,
                state.a0 + state.b0 + state.c0,
                state.a1 + state.b1 + state.c1,
                state.a2 + state.b2 + state.c2
            ];

        // Loop over all of the rows and check if any of them compare to either 'XXX' or 'OOO'
        for (var i = 0; i < rows.length; i++) {
            if (rows[i] === matches[0] || rows[i] === matches[1]) {
                return true;
            }
        }
    }, [])

    const rewardUser = useCallback(async (opponent) => {

        // reward amount, 0.1 CELO
        let amount = formatNumber(parseFloat(0.1));

        // game history for user's win starts with his symbol(X or O)
        let history = symbol.current;

        const elements = document.getElementsByClassName("board")[0].childNodes

        elements.forEach(function (element) {
            history += element.innerText || "E";
        });

        if (TransactionsContract) {
            try {
                rewarded.current = true;
                setDisabled(true)

                await getReward(TransactionsContract, performActions, amount, history, symbol.current, opponent, signature);

                // Update user's balance in the header
                updateBalance();
            } catch (e) {
                console.log({ e })
            } finally {
                setLoading(false)
            }
        }
        // return;
    }, [performActions, TransactionsContract, updateBalance, signature])

    useEffect(() => {

        // Event is called when either player makes a move
        socket.on("move.made", function (data) {

            // Render the move
            setCells((prevState) => ({ ...prevState, [data.position]: data.symbol }))

            // If the symbol is the same as the player's symbol,
            // we can assume it is their turn
            myTurn.current = data.symbol !== symbol.current;

            // If the game is still going, show who's turn it is
            if (!isGameOver()) {
                renderTurnMessage();

                // If the game is over
            } else {
                // Show the message for the loser
                if (myTurn.current) {

                    setMessage("Game over. You lost." + play_again_button)

                    // Show the message for the winner
                } else {
                    setMessage("Game over. You won!")

                    if (rewarded.current === false)
                        rewardUser(data.op_address);

                    return;
                }

                // Disable the board
                setDisabled(true)
            }
        });

        // Set up the initial state when the game begins
        socket.on("game.begin", function (data) {
            // The server will asign X or O to the player
            symbol.current = data.symbol;

            // Give X the first turn
            myTurn.current = data.symbol === "X";

            renderTurnMessage();
        });

        // Disable the board if the opponent leaves
        socket.on("opponent.left", function () {
            setMessage("Your opponent left the game." + play_again_button)
            setDisabled(true)
        });

        setLoading(false);

    }, [myTurn, symbol, isGameOver, rewardUser, socket]);

    useLayoutEffect(() => {
        rewarded.current = false;
        socket.connect();

        socket.emit("connect.address", {
            address: address
        });

    }, [socket, TransactionsContract, performActions, address])

    // Retrieves current board state
    function getBoardState() {
        var obj = {};

        // We will compose an object of all of the Xs and Ox
        // that are on the board
        // At this moment, cells variable is not updated, so we retrieving cells values from DOM
        const elements = document.getElementsByClassName("board")[0].childNodes

        elements.forEach(function (element) {
            obj[element.id] = element.innerText || "";
        });

        return obj;
    }

    function renderTurnMessage() {

        // Disable the board if it is the opponents turn
        if (!myTurn.current) {
            setMessage("Your opponent's turn")
            setDisabled(true)
            // Enable the board if it is your turn
        } else {
            setMessage("Your turn.")
            setDisabled(false)
        }
    }

    function makeMove(e) {
        e.preventDefault();

        // It's not your turn
        if (!myTurn.current) {
            return;
        }

        // The space is already checked
        if (cells[e.target.id].length) {
            return;
        }

        // Emit the move to the server
        socket.emit("make.move", {
            symbol: symbol.current,
            position: e.target.id,
            address: address
        });
    }

    return (
        <>
            {!loading
                ?
                <Container className="game-page">
                    <Row className="justify-content-center">
                        <Col md="6" className="align-self-center">
                            <Alert variant="dark" style={{ width: "350px", margin: "auto", marginBottom: "1em" }} >
                                <div dangerouslySetInnerHTML={{ __html: message }}></div>
                            </Alert>
                            <div className="board">

                                <button id="a0" onClick={(e) => makeMove(e)} disabled={disabled}>{cells.a0}</button>
                                <button id="a1" onClick={(e) => makeMove(e)} disabled={disabled}>{cells.a1}</button>
                                <button id="a2" onClick={(e) => makeMove(e)} disabled={disabled}>{cells.a2}</button>

                                <button id="b0" onClick={(e) => makeMove(e)} disabled={disabled}>{cells.b0}</button>
                                <button id="b1" onClick={(e) => makeMove(e)} disabled={disabled}>{cells.b1}</button>
                                <button id="b2" onClick={(e) => makeMove(e)} disabled={disabled}>{cells.b2}</button>

                                <button id="c0" onClick={(e) => makeMove(e)} disabled={disabled}>{cells.c0}</button>
                                <button id="c1" onClick={(e) => makeMove(e)} disabled={disabled}>{cells.c1}</button>
                                <button id="c2" onClick={(e) => makeMove(e)} disabled={disabled}>{cells.c2}</button>

                            </div>
                        </Col>
                    </Row>
                </Container>
                :
                <Loader />
            }
        </>
    );
}

export default Game;