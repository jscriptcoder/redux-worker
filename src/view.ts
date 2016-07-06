import { appStore } from './store'
import serviceWorker from './worker/service';
import { TileModel, tileId2Subscription } from './models/tile'
import * as actions from './actions'
import TilesGrid from './components/tiles-grid'

const tilesGrid = new TilesGrid(document.getElementById('tiles-grid'));

tilesGrid.onbuttonclick = (howMany: number) => serviceWorker.addTiles(howMany);
tilesGrid.ontilecloseclick = (tileId: number) => serviceWorker.removeTile(tileId);
tilesGrid.ontilerangechange = (tileId: number, threshold: number) => {
	serviceWorker.updateTileThreshold(tileId, threshold);
}

export const addTile = (tile: TileModel) => {
	console.log('Added new tile:', tile);

	tilesGrid.addTile(tile);
	serviceWorker.subscribeServiceAmount(tile.id);
}

export const removeTile = (tileId: number) => {
	console.log('Tile removed with id:', tileId);

	tilesGrid.removeTile(tileId);
	serviceWorker.unsubscribeServiceAmount(tileId);
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