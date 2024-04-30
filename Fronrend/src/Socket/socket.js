import { io } from "socket.io-client";

const Notifactionsocket = io(`${process.env.REACT_APP_BACKEND_URL}/notification`)

export default Notifactionsocket;