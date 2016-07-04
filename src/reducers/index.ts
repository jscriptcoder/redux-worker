import 'es6-shim'
import { ACTIONS, ActionTilesGrid } from '../actions'
import Tile from '../models/tile'
import * as utils from '../utils'

const tileReducer = (state: Tile = new Tile(), action: ActionTilesGrid): Tile => {

	switch (action.type) {

		case ACTIONS.UPDATE_TILE_AMOUNT:
			return Object.assign(new Tile(), {
				id: state.id,
				amount: action.amount,
				threshold: state.threshold
			});

		case ACTIONS.UPDATE_TILE_THRESHOLD:
			return Object.assign(new Tile(), {
				id: state.id,
				amount: state.amount,
				threshold: action.threshold
			});

		default:
			return state;
	}

}

const tilesGridReducer = (state: Tile[] = [], action: ActionTilesGrid): Tile[] => {
	let newState: Tile[];

	switch (action.type) {

		case ACTIONS.ADD_TILE:
			return [
				...state,
				Object.assign(new Tile(), {
					id: utils.uid(),
					threshold: utils.random(40, 60)
				})
			];
		
		case ACTIONS.ADD_TILES:
			newState = [...state];
			let count = action.howMany || 1;
			while (count--) {
				newState.push(Object.assign(new Tile(), {
					id: utils.uid(),
					threshold: utils.random(40, 60)
				}));
			}
			return newState;

		case ACTIONS.REMOVE_TILE:
			return state.filter((tile: Tile) => tile.id !== action.id);

		case ACTIONS.UPDATE_TILE_AMOUNT:
		case ACTIONS.UPDATE_TILE_THRESHOLD:
			newState = [...state];
			const tileIndex = newState.findIndex((tile: Tile) => tile.id === action.id);
			newState[tileIndex] = tileReducer(newState[tileIndex], action);
			return newState;

		default:
			return state;
	}

}

export default tilesGridReducer;
