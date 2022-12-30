import { useLayoutEffect, useCallback, useRef } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Container, Nav } from "react-bootstrap";
import { useContractKit } from "@celo-tools/use-contractkit";
import { Notification } from "./components/ui/Notifications";
import Wallet from "./components/Wallet";
import Cover from "./components/Cover";
import Game from "./components/Game";
import Profile from "./components/Profile";
import LeaderBoard from "./components/LeaderBoard";
import { useBalance, useTransactionsContract, useTictactoeContract } from "./hooks";
import "./App.css";

import { socket } from "./utils/socket";

const App = function AppWrapper() {
  const { address, destroy, connect, getConnectedKit } = useContractKit();
  const { balance, getBalance } = useBalance();

  const TransactionsContract = useTransactionsContract();

  // Contract to deal with nft achievements
  const TictactoeContract = useTictactoeContract();

  // Kit to use in hextoutf8 function
  let kit = useRef(null);

  // Decode from hex to utf8, passes to children
  const hextoutf8 = (str) => {
    return kit.current.web3.utils.hexToAscii(str);
  }

  const getContract = useCallback(async () => {
    kit.current = await getConnectedKit();
  }, [getConnectedKit]);

  useLayoutEffect(() => {
    if (address) getContract();
  }, [address, getContract]);

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
              <Nav.Item className="me-auto">
                <Link className="nav-link link-dark" to="/leaderboard">LeaderBoard</Link>

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

                {/* Index route with tictactoe board */}
                <Route index element={<Game address={address} socket={socket} updateBalance={getBalance} TransactionsContract={TransactionsContract} />} />

                {/* Route for user's profile page */}
                <Route path="/profile" element={<Profile address={address} hextoutf8={hextoutf8} socket={socket} updateBalance={getBalance} TransactionsContract={TransactionsContract} TictactoeContract={TictactoeContract} />} />

                {/* Route for leaderboard */}
                <Route path="/leaderboard" element={<LeaderBoard hextoutf8={hextoutf8} socket={socket} TransactionsContract={TransactionsContract} />} />

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
