import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Container, Nav } from "react-bootstrap";
import { useContractKit } from "@celo-tools/use-contractkit";
import { Notification } from "./components/ui/Notifications";
import Wallet from "./components/Wallet";
import Cover from "./components/Cover";
import Game from "./components/Game";
import Profile from "./components/Profile";
import { useBalance, useTransactionsContract, useTictactoeContract } from "./hooks";
import "./App.css";

import { socket } from "./utils/socket";

const App = function AppWrapper() {
  const { address, destroy, connect } = useContractKit();
  const { balance, getBalance } = useBalance();

  const TransactionsContract = useTransactionsContract();

  // Contract to deal with nft achievements
  const TictactoeContract = useTictactoeContract();

  return (
    <>
      <Notification />
      {address ? (
        <BrowserRouter>
          <Container fluid="md">
            <Nav className="justify-content-end pt-3 pb-5">
              <Nav.Item className="me-auto">
                <h3>
                  <Link className="link-dark text-decoration-none" to="/">Tic Tac Toe</Link>
                </h3>
              </Nav.Item>
              <Nav.Item>
                {/*display user wallet*/}
                <Wallet
                  address={address}
                  amount={balance.CELO}
                  symbol="CELO"
                  destroy={destroy}
                />
              </Nav.Item>
            </Nav>
            {/* display cover */}
            <main>
              <Routes>

                {/* Route for user's profile page */}
                <Route path="/profile" element={<Profile socket={socket} updateBalance={getBalance} TransactionsContract={TransactionsContract} TictactoeContract={TictactoeContract} />} />

                {/* Index route with tictactoe board */}
                <Route index element={<Game socket={socket} updateBalance={getBalance} TransactionsContract={TransactionsContract} />} />
              
              </Routes>
            </main>
          </Container>

        </BrowserRouter>
      ) : (
        // display cover if user is not connected
        <div className="App">
          <header className="App-header">
            <Cover connect={connect} />
          </header>
        </div>
      )}
    </>
  );
};

export default App;
