import { Subscription } from 'rxjs/Subscription';

export default class Tile {
	public id: number;
	public amount: number;
	public threshold: number;
}

export type TileModel = Tile;

// will keep track of subscription to the backend
export const tileId2Subscription: { [tileId: string]: Subscription } = {};