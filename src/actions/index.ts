export enum ACTIONS {
    ADD_TILE,
    ADD_TILES,
    REMOVE_TILE,
    UPDATE_TILE_AMOUNT,
    UPDATE_TILE_THRESHOLD
}

interface Action { type: ACTIONS }

export interface ActionTilesGrid extends Action {
    id?: number;
    howMany?: number;
    amount?: number;
    threshold?: number;   
}

export const addTile = (): ActionTilesGrid => {
	return { type: ACTIONS.ADD_TILE };
}

export const addTiles = (howMany: number): ActionTilesGrid => {
    return { type: ACTIONS.ADD_TILES, howMany };
}

export const removeTile = (id: number): ActionTilesGrid => {
	return { type: ACTIONS.REMOVE_TILE, id };
}

export const updateTileAmount = (id: number, amount: number): ActionTilesGrid => {
	return { type: ACTIONS.UPDATE_TILE_AMOUNT, id, amount };
}

export const updateTileThreshold = (id: number, threshold: number): ActionTilesGrid => {
	return { type: ACTIONS.UPDATE_TILE_THRESHOLD, id, threshold };
}