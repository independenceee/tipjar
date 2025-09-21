export const DECIMAL_PLACE = 1_000_000;

export const title = {
    mint: "tipjar.contract.mint",
    store: "tipjar.contract.spend",
};

export enum HeadStatus {
    IDLE = "IDLE",
    DISCONNECTED = "DISCONNECTED",
    CONNECTING = "CONNECTING",
    CONNECTED = "CONNECTED",
    INITIALIZING = "INITIAL",
    OPEN = "OPEN",
    CLOSED = "CLOSED",
    FANOUT_POSSIBLE = "FANOUT_POSSIBLE",
    FINAL = "FINAL",
}
