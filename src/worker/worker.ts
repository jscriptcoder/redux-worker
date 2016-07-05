import { appStore, TilesGridState } from '../store'
import { serviceAmount } from '../backend'
import { TileModel, tileId2Subscription } from '../models/tile'
import * as actions from '../actions'
import {
	MESSAGES, 
	MessageWorker, 
	newTilesMsg, 
	removeTileMsg, 
	updateTileMsg } from './messages'

class StressedWorker {

	private postMessage: typeof postMessage;

	constructor() {
		// hooks up global methods
		this.postMessage = postMessage;
		onmessage = this.onmessage.bind(this);
	}

	private onmessage(event: MessageEvent): void {

		const message: MessageWorker = event.data;

		switch (message.type) {
			case MESSAGES.SUBSCRIBE_STORE:
				this.subscribeStore();
				break;

			case MESSAGES.SUBSCRIBE_SERVICE_AMOUNT:
				this.subscribeServiceAmount(message.id);
				break;

			case MESSAGES.UNSUBSCRIBE_SERVICE_AMOUNT:
				this.unsubscribeServiceAmount(message.id);
				break;

			default:
				break;
		}	

	}

	private subscribeStore(): void {
		appStore.subscribe((newState: TilesGridState, oldState: TilesGridState) => {

			if (appStore.stateHasChanged()) {

				if (appStore.isNewItem()) {

					const howMany = newState.length - oldState.length;
					const sliceIdx = newState.length - howMany;
					const newTiles = newState.slice(sliceIdx);

					this.postMessage(newTilesMsg(newTiles), null);

				} else if (appStore.isItemDeleted()) {

					const oldTile = oldState.find((tile: TileModel) => newState.indexOf(tile) === -1);
					this.postMessage(removeTileMsg(oldTile.id), null);

				} else {

					let oldTile: TileModel;
					const newTile = newState.find((tile: TileModel, index: number) => {
						oldTile = oldState[index];
						return tile !== oldTile;
					});

					this.postMessage(updateTileMsg(newTile, oldTile), null);
				}
			}
		});
	}

	private subscribeServiceAmount(tileId: number): void {
		tileId2Subscription[tileId] = serviceAmount.subscribe((amount: number) => {
			appStore.dispatch(actions.updateTileAmount(tileId, amount));
		});
	}

	private unsubscribeServiceAmount(tileId: number): void {
		tileId2Subscription[tileId].unsubscribe();
		delete tileId2Subscription[tileId];
	}

}

new StressedWorker();