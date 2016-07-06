import { TileModel } from '../models/tile'
import {
	MESSAGES, 
	MessageWorker, 
	subscribeStoreMsg, 
	subscribeServiceAmountMsg, 
	unsubscribeServiceAmountMsg, 
	newTilesMsg, 
	removeTileMsg, 
	updateTileMsg } from './messages'

// borrows some actions. We should definitely merge messages and actions
import {
	addTiles, 
	removeTile, 
	updateTileThreshold } from '../actions'

class ServiceWorker {

	private worker: Worker;

	constructor(url: string) {
		this.worker = new Worker(url);
		this.worker.onmessage = this.messageHandler.bind(this);
	}

	public subscribeStore(): void {
		this.worker.postMessage(subscribeStoreMsg());
	}

	public subscribeServiceAmount(tileId: number): void {
		this.worker.postMessage(subscribeServiceAmountMsg(tileId));
	}

	public unsubscribeServiceAmount(tileId: number): void {
		this.worker.postMessage(unsubscribeServiceAmountMsg(tileId));
	}

	public addTiles(howMany: number): void {
		this.worker.postMessage(addTiles(howMany));
	}

	public removeTile(tileId: number): void {
		this.worker.postMessage(removeTile(tileId));
	}

	public updateTileThreshold(tileId: number, threshold: number): void {
		this.worker.postMessage(updateTileThreshold(tileId, threshold));
	}

	// must be implemented outside
	public onnewtiles(tiles: TileModel[]): void { }
	public onremovetile(tileId: number): void { }
	public onupdatetile(newTile: TileModel, oldTile: TileModel): void { }

	private messageHandler(event: MessageEvent): void {
		
		const message: MessageWorker = event.data;

		switch (message.type) {
			case MESSAGES.NEW_TILES:
				this.onnewtiles(message.tiles);
				break;
			case MESSAGES.REMOVE_TILE:
				this.onremovetile(message.id);
				break;
			case MESSAGES.UPDATE_TILE:
				this.onupdatetile(message.newTile, message.oldTile);
				break;
		}

	}

}

// maybe a bit more configurable?
const serviceWorker = new ServiceWorker('worker.js');
export default serviceWorker;