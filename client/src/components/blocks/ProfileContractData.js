import React, { useState, useEffect, useCallback } from "react";
import { getAddress, getBalance, depositToContract } from "../../utils/transactions";
import { formatBigNumber, formatNumber } from "../../utils";
import { NotificationError, NotificationSuccess } from '../ui/Notifications'
import { useContractKit } from "@celo-tools/use-contractkit";
import { Container, Row, Col, Button } from "react-bootstrap";
import '../styles/ProfileContractData.css'
import Loader from "../ui/Loader";

/*
    Block in the profile page, provides an information about contract(address and balance)
    and deposit to contract function
*/
const ProfileContractData = ({ TransactionsContract, updateBalance }) => {

    const [loading, setLoading] = useState(true);

    // Contract address
    const [address, setAddress] = useState(false);

    // Contract balance
    const [balance, setBalance] = useState(0);

    const [error, setError] = useState(false);

    const [success, setSuccess] = useState(false);

    // Amount to deposit to the contract
    const [depositAmount, setDepositAmount] = useState(0);

    const { performActions } = useContractKit();

    // Updating Transcations.sol contract data
    const updateContractData = useCallback(async () => {
        try {

            // Setting an address of the contract
            const address = await getAddress(TransactionsContract)

            setAddress(address)

            // Setting a balance of the contract
            const balance = await getBalance(TransactionsContract)

            setBalance(formatBigNumber(parseInt(balance)))

        } catch (e) {
            console.log({ e })
        } finally {
            setLoading(false)
        }
    }, [TransactionsContract]);

    useEffect(() => {
        try {
            if (TransactionsContract) {
                updateContractData();
            }
        } catch (e) {
            console.log({ e });
        }
    }, [TransactionsContract, updateContractData]);

    /* Deposit to contract function
        If the value of the input is not a number > 0, shows an error to user
    */
    const deposit = async () => {
        if (depositAmount > 0) {

            await depositToContract(TransactionsContract, performActions, formatNumber(parseFloat(depositAmount)))

            // Update user's balance in the header
            updateBalance();

            // Update contract's balance after the deposit
            updateContractData();

            setSuccess("You are successfully deposited to the contract, thank you !")
        } else {
            setError("Plase enter valid value")
        }
    }

    return (
        <>
            {!loading
                ?
                <Container className="profile-contract-data">
                    <Row className="justify-content-center">
                        <Col md="10">
                            <Col className="col">
                                Current contract address:
                                <a href={`https://alfajores-blockscout.celo-testnet.org/address/${address}/transactions`} rel="noreferrer" target="_blank">
                                    <span id="contract_address">&nbsp;{address}</span>
                                </a>
                            </Col>
                            <Col className="col">
                                Current contract balance:
                                <span id="contract_balance">&nbsp;{balance} CELO</span>
                            </Col>
                        </Col>

                        <Col md="10">


                            You can invest in our project to reward users
                            {error && <NotificationError text={error} />}
                            {success && <NotificationSuccess text={success} />}

                            <div style={{ marginTop: "1em" }}>
                                <input type="number" className="form-control" onChange={e => setDepositAmount(e.target.value)} id="deposit_contract_input" required placeholder="Enter Amount" />
                                <Button onClick={() => deposit()} variant="dark" id="deposit_contract">Send CELO to the Contract</Button>

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

export default ProfileContractData;