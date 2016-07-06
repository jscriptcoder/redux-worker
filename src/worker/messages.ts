import { TileModel } from '../models/tile'

// similar to actions. Maybe we should combine them?
export enum MESSAGES {
    SUBSCRIBE_STORE = 100,
    SUBSCRIBE_SERVICE_AMOUNT = 101,
    UNSUBSCRIBE_SERVICE_AMOUNT = 102,
    NEW_TILES = 103,
    REMOVE_TILE = 104,
    UPDATE_TILE = 105
}

interface Message { type: MESSAGES }

export interface MessageWorker extends Message {
	tiles?: TileModel[],
	id?: number,
	newTile?: TileModel,
	oldTile?: TileModel
}

export const subscribeStoreMsg = (): MessageWorker => {
	return { type: MESSAGES.SUBSCRIBE_STORE };
}

export const newTilesMsg = (tiles: TileModel[]): MessageWorker => {
	return { type: MESSAGES.NEW_TILES, tiles };
}

export const removeTileMsg = (id: number): MessageWorker => {
	return { type: MESSAGES.REMOVE_TILE, id };
}

export const updateTileMsg = (newTile: TileModel, oldTile: TileModel): MessageWorker => {
	return { type: MESSAGES.UPDATE_TILE, newTile, oldTile };
}

export const subscribeServiceAmountMsg = (id: number): MessageWorker => {
	return { type: MESSAGES.SUBSCRIBE_SERVICE_AMOUNT, id };
}

export const unsubscribeServiceAmountMsg = (id: number): MessageWorker => {
	return { type: MESSAGES.UNSUBSCRIBE_SERVICE_AMOUNT, id };
}