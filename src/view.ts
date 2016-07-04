import { appStore } from './store'
import { serviceAmount } from './backend'
import { TileModel, tileId2Subscription } from './models/tile'
import * as actions from './actions'
import TilesGrid from './components/tiles-grid'

const tilesGrid = new TilesGrid(document.getElementById('tiles-grid'));

tilesGrid.onbuttonclick = (howMany: number) => appStore.dispatch(actions.addTiles(howMany));
tilesGrid.ontilecloseclick = (tileId: number) => appStore.dispatch(actions.removeTile(tileId));
tilesGrid.ontilerangechange = (tileId: number, threshold: number) => {
	appStore.dispatch(actions.updateTileThreshold(tileId, threshold));
}

export const addTile = (tile: TileModel) => {
	console.log('Added new tile:', tile);

	tilesGrid.addTile(tile);
	tileId2Subscription[tile.id] = serviceAmount.subscribe((amount: number) => {
		appStore.dispatch(actions.updateTileAmount(tile.id, amount));
	});
}

export const removeTile = (tile: TileModel) => {
	console.log('Tile removed:', tile);

	tilesGrid.removeTile(tile.id);
	tileId2Subscription[tile.id].unsubscribe();
	delete tileId2Subscription[tile.id];
}

export const updateTile = (newTile: TileModel, oldTile: TileModel) => {
	if (newTile.amount !== oldTile.amount) { // amount has changed

		tilesGrid.updateTileAmount(newTile.id, newTile.amount);

	} else if (newTile.threshold !== oldTile.threshold) { // threshold has changed

		tilesGrid.updateOtherTilesThreshold(
			newTile.id,
			newTile.threshold - oldTile.threshold
		);

	}
}