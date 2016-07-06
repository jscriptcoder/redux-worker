import 'es6-shim'
import './index.scss'
import serviceWorker from './worker/service';
import { MessageWorker } from './worker/messages';
import { TileModel } from './models/tile'
import * as view from './view'

serviceWorker.onnewtiles = (newTiles: TileModel[]) => newTiles.forEach((tile: TileModel) => view.addTile(tile));
serviceWorker.onremovetile = (tileId: number) => view.removeTile(tileId);
serviceWorker.onupdatetile = (newTile: TileModel, oldTile: TileModel) => view.updateTile(newTile, oldTile);
serviceWorker.subscribeStore();