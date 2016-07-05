import { appStore, TilesGridState } from '../store'
import { TileModel } from '../models/tile'
import { MESSAGES, newTilesMsg, removeTileMsg, updateTileMsg } from './messages'

class StressedWorker {

	private postMessage: typeof postMessage;

	constructor() {
		this.postMessage = postMessage;
		onmessage = this.onmessage.bind(this);
	}

	private onmessage(event: MessageEvent): void {

		switch (event.data.message) {
			case MESSAGES.SUBSCRIBE_STORE:
				break;
			default:
				break;
		}

	}

	public subscribeStore(): void {
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

}

new StressedWorker();