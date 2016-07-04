import { appStore, TilesGridState } from '../store'
import { TileModel } from '../models/tile'

class StressedWorker {

	private postMessage: typeof postMessage;

	constructor() {
		this.postMessage = postMessage;
		onmessage = this.onmessage.bind(this);
	}

	private onmessage(event: MessageEvent): void {

		switch (event.data.message) {
			case 'SUBSCRIBE_STORE':
				break;
			case 'STATE_HAS_CHANGED':
				break;
			case 'STATE_HAS_NEW_ITEM':
				break;
			case 'STATE_HAS_DELETED_ITEM':
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

					//for(let tile of newTiles) view.addTile(tile);
					this.postMessage();

				} else if (appStore.isItemDeleted()) {

					const oldTile = oldState.find((tile: TileModel) => newState.indexOf(tile) === -1);
					//view.removeTile(oldTile);
					this.postMessage();

				} else {

					let oldTile: TileModel;
					const newTile = newState.find((tile: TileModel, index: number) => {
						oldTile = oldState[index];
						return tile !== oldTile;
					});

					//view.updateTile(newTile, oldTile);
					this.postMessage();
				}
			}
		});
	}

}

new StressedWorker();