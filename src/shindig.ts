import Peer from "peerjs";

export class Party {
  constructor(public maxSize: number) {}

  genInvite(): string {
    throw new Error("not implemented");
  }
}

export class Player {
  public peer: Peer;
  private _nickname: string | undefined = undefined;

  constructor(peer?: Peer) {
    if (peer === undefined) {
      peer = new Peer();
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
