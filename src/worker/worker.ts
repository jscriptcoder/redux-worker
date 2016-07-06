import 'es6-shim'
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

// TODO: merge messages and actions
import {
	ACTIONS, 
	ActionTilesGrid, 
	addTiles, 
	removeTile,
	updateTileThreshold } from '../actions'

// crap I need to do so postMessage isn't mistaken for window.postMessage
declare function postMessage(data: any): void;

class StressedWorker {

	public onmessage(event: MessageEvent): void {

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
		}

		const action: ActionTilesGrid = event.data;
		switch (action.type) {
			case ACTIONS.ADD_TILES:
			case ACTIONS.REMOVE_TILE:
			case ACTIONS.UPDATE_TILE_THRESHOLD:
				appStore.dispatch(action);
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

					postMessage(newTilesMsg(newTiles));

				} else if (appStore.isItemDeleted()) {

					const oldTile = oldState.find((tile: TileModel) => newState.indexOf(tile) === -1);
					postMessage(removeTileMsg(oldTile.id));

				} else {

					let oldTile: TileModel;
					const newTile = newState.find((tile: TileModel, index: number) => {
						oldTile = oldState[index];
						return tile !== oldTile;
					});

					postMessage(updateTileMsg(newTile, oldTile));
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

const stressedWorker = new StressedWorker();
onmessage = (event: MessageEvent) => stressedWorker.onmessage(event);