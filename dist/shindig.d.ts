/** Provide generic multiplayer support for web games. */
import Peer from "peerjs";
import EE from "eventemitter3";
/** Specify url parameters used by shindig. */
export declare const urlParams: {
    /** Share current party members' ids with joining player. */
    peers: string;
};
/** Modifiable version of `location.assign`. */
declare let locAssign: (url: string) => void;
/** Allow shindig to trigger location assigns if it was loaded cross-origin (CDN). */
export declare function onAssign(f: typeof locAssign): typeof locAssign;
/** Return true if PeerJS's requirements are met.
 * @ignore
 */
export declare function compatible(): boolean;
/** Represent the local in the game. */
export declare class LocalPlayer {
    peer: Peer;
    private _nickname;
    constructor(peer?: Peer);
    nickname: string;
}
/** Represent a group of players (excluding local player) playing together. */
export declare class Party extends EE<{
    joinRequest: [JoinRequest];
}> {
    maxSize: number;
    home: LocalPlayer;
    /** All players in the party. */
    players: Set<Peer.DataConnection>;
    constructor(maxSize: number, home?: LocalPlayer);
    /** Generate url that a browser can follow to join  */
    genInvite(): string;
}
/** Build a party if a migration is taking place, otherwise create new party. */
export declare function getParty(maxSize: number, timeout?: number): Promise<Party>;
/** Request from a player to join the party. */
export declare class JoinRequest extends EE<{
    accept: [];
    reject: [];
}> {
    /** Indicate a desire to accept the join request. */
    accept(): boolean;
    /** Indicate a desire to reject the join request. */
    reject(): boolean;
}
export {};
