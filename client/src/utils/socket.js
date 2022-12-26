import socketIOClient from "socket.io-client";
import {server_domain} from './constants'

export const socket = socketIOClient(server_domain, { transports: ["websocket"] }).disconnect();