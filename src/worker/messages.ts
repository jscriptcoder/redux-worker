import { TileModel } from '../models/tile'

export enum MESSAGES {
    SUBSCRIBE_STORE,
    NEW_TILES,
    REMOVE_TILE,
    UPDATE_TILE
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