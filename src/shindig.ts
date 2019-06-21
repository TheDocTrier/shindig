/** Provide generic multiplayer support for web games. */

import Peer from "peerjs";
import * as peerjs from "peerjs";
import EE from "eventemitter3";

/** Specify url parameters used by shindig. */
export const urlParams = {
  /** Share current party members' ids with joining player. */
  peers: "shindig_peers"
};

/** Modifiable version of `location.assign`. */
let locAssign: (url: string) => void = window.location.assign;

/** Allow shindig to trigger location assigns if it was loaded cross-origin (CDN). */
export function onAssign(f: typeof locAssign): typeof locAssign {
  const oldAssign = locAssign;
  locAssign = f;
  return oldAssign;
}

/** Return true if PeerJS's requirements are met.
 * @ignore
 */
export function compatible(): boolean {
  return true; // fix once peerjs types are fixed
}

/** Represent the local in the game. */
export class LocalPlayer {
  public peer: Peer;
  private _nickname: string | undefined = undefined;

  constructor(peer?: Peer) {
    if (peer === undefined) {
      peer = new Peer({
        secure: true
      });
    }
    this.peer = peer;
  }

  get nickname(): string {
    if (this._nickname !== undefined) {
      return this._nickname;
    } else {
      return this.peer.id;
    }
  }

  set nickname(name: string) {
    this._nickname = name;
  }
}

/** Represent a group of players (excluding local player) playing together. */
export class Party extends EE<{ joinRequest: [JoinRequest] }> {
  /** All players in the party. */
  public players = new Set<peerjs.DataConnection>();

  constructor(public maxSize: number, public home = new LocalPlayer()) {
    super();
  }

  /** Generate url that a browser can follow to join  */
  genInvite(): string {
    const allPeers = Array.from(this.players.values()).map(conn => conn.peer);
    const url = new URL(document.location.href);
    url.searchParams.append(
      urlParams.peers,
      encodeURIComponent(JSON.stringify(allPeers))
    );
    throw new Error("not implemented");
  }
}

/** Build a party if a migration is taking place, otherwise create new party. */
export async function getParty(maxSize: number, timeout = 5): Promise<Party> {
  const party = new Party(maxSize);
  if (isMigrating()) {
    party.home.peer.on("connection", conn => {});
  }
  return party;
}

/** Returns known peers from migration. */
function isMigrating(): string[] {
  const peersString = new URL(document.location.href).searchParams.get(
    urlParams.peers
  );

  if (peersString === null) {
    return [];
  } else {
    return JSON.parse(peersString);
  }
}

/** Request from a player to join the party. */
export class JoinRequest extends EE<{ accept: []; reject: [] }> {
  /** Indicate a desire to accept the join request. */
  accept() {
    return this.emit("accept");
  }

  /** Indicate a desire to reject the join request. */
  reject() {
    return this.emit("reject");
  }
}
