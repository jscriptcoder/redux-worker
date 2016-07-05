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

class ServiceWorker extends Worker {

	constructor(url: string) {
		super(url);
		this.onmessage = this.messageHandler.bind(this);
	}

	public subscribeStore(): void {
		this.postMessage(subscribeStoreMsg());
	}

	public subscribeServiceAmount(tileId: number): void {
		this.postMessage(subscribeServiceAmountMsg(tileId));
	}

	public unsubscribeServiceAmount(tileId: number): void {
		this.postMessage(unsubscribeServiceAmountMsg(tileId));
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