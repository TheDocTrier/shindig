import Peer from "peerjs";
export declare class Party {
    maxSize: number;
    constructor(maxSize: number);
    genInvite(): string;
}
export declare class Player {
    peer: Peer;
    private _nickname;
    constructor(peer?: Peer);
    nickname: string;
}
