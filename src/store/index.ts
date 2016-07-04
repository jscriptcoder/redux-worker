import { createStore, Store } from 'redux'
import { ACTIONS, ActionTilesGrid } from '../actions'
import tilesGridReducer from '../reducers';
import TileModel from '../models/tile'

export type RootReducer = typeof tilesGridReducer;
export type TilesGridState = TileModel[];
export type TilesGridStore = Store<TilesGridState>

export interface AppStoreListener {
	(newState: TilesGridState, oldState: TilesGridState): void;
}

class AppStore {

	private store: TilesGridStore;
	private oldState: TilesGridState;

	constructor(reducer: RootReducer) {
		this.store = createStore<TilesGridState>(reducer);
		this.oldState = this.store.getState();
	}

	public subscribe(listener: AppStoreListener): void {
		this.store.subscribe(() => {
			const newState = this.store.getState();
			listener(newState, this.oldState);
			this.oldState = newState;
		});
	}

	public dispatch(action: ActionTilesGrid): void {
		this.store.dispatch(action);
	}

	public stateHasChanged(): boolean {
		return this.store.getState() !== this.oldState;
	}

	public isNewItem(): boolean {
		return this.store.getState().length > this.oldState.length;
	}

	public isItemDeleted(): boolean {
		return this.store.getState().length < this.oldState.length;
	}

}

export const appStore = new AppStore(tilesGridReducer);