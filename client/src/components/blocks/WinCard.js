import { Row, Col, Card } from "react-bootstrap";
import "../styles/Game.css";

// Functional component that returns a game history card
const WinCard = ({ element, mkey }) => {
    const results = element.result

    // In the history string user's point stays on the first position
    const user_point = element.result[0]

    const date = new Date(parseInt(element.timestamp) * 1000);

    // Render of every cell
    const renderCell = (key_) => {
        return (
            <button key={key_} style={results[key_] === user_point ? { backgroundColor: "lightgreen" } : null}>
                {results[key_] !== 'E' ? results[key_] : ' '}
            </button>
        )
    }

    return (
        <Card className="game-page" style={{ width: "100%", margin: "2em 0" }}>
            <Card.Body>
                {date.getHours() + ":" + date.getMinutes() + ", " + date.toDateString()} -
                <a target="_blank" href={"https://explorer.celo.org/alfajores/tx/" + element.hash} rel="noreferrer">
                    <h6 className="card-title">{element.hash}</h6>
                </a>
                <Card.Body>
                    <Row className="justify-content-center">
                        <Col md="6" className="align-self-center">
                            <div className="board">
                                {[...Array(9)].map((x, i) =>
                                    renderCell(i + 1)
                                )}
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card.Body>
        </Card>
    )
}

export default WinCard;