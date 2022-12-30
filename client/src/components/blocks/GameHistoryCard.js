import { Row, Col, Card } from "react-bootstrap";
import "../styles/Game.css";

// Functional component that returns a game history card
const GameHistoryCard = ({ symbol, element, mkey }) => {
    const results = element.history_

    const date = new Date(parseInt(element.timestamp));

    // Render of every cell
    const renderCell = (key_) => {
        const color = results[key_] === symbol ? { backgroundColor: symbol === results[0] ? "lightgreen" : "red" } : null;
        return (
            <button key={key_} style={color}>
                {results[key_] !== 'E' ? results[key_] : ' '}
            </button>
        )
    }

    return (
        <Card className="game-page" style={{ width: "100%", margin: "2em 0" }}>
            <Card.Body>
                {date.getHours() + ":" + date.getMinutes() + ", " + date.toDateString()}<br />
                opponent - {element.opponent}
                <Card.Body>
                    <Row className="justify-content-center">
                        <Col md="6" className="align-self-center">
                            <div className="board">
                                <div>
                                    {[...Array(9)].map((x, i) =>
                                        renderCell(i + 1)
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card.Body>
        </Card>
    )
}

export default GameHistoryCard;