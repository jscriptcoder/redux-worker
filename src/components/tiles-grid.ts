import './tiles-grid.scss'
import 'rxjs/add/observable/fromEvent'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import { TileModel } from '../models/tile'
import Component from './component'
import Tile from './tile';

const TILES_GRID_TMPL = `
<div class="tiles-grid">
	<div class="actions">
		<button>Add Tile</button>
		<input type="number" value="1" max="1000" />
	</div>
	<div class="list"></div>
</div>
`;

const doSomeMagic = (value: number, deltaValue: number, distance: number): number => {
	return value + Math.round(deltaValue / (distance * 1.025));
}

export default class TilesGrid extends Component {

	private tiles: Tile[] = [];
	private buttonEl: HTMLElement;
	private inputEl: HTMLInputElement;
	private listEl: HTMLElement;
	private clickSubscription: Subscription;

	constructor(container: HTMLElement) {
		super(container);
		this.buildDOM();
	}

	protected buildDOM(): void {
		this.el = Component.string2Element(TILES_GRID_TMPL);
		this.buttonEl = this.findElement('button');
		this.inputEl = <HTMLInputElement>this.findElement('input');
		this.listEl = this.findElement('.list');

		this.clickSubscription = Observable
			.fromEvent(this.buttonEl, 'click')
			.subscribe(() => {
				const numTiles = +this.inputEl.value || 1;
				this.onbuttonclick(numTiles);
			});

		this.container.appendChild(this.el);
	}

	// must be set outside
	public onbuttonclick(howMany: number): void { }
	public ontilecloseclick(tileId: number): void { }
	public ontilerangechange(tileId: number, threshold: number): void { }

	public addTile(tileModel: TileModel): void {
		const tile = new Tile(this.listEl, tileModel.id);

		tile.amount = tileModel.amount;
		tile.threshold = tileModel.threshold;
		tile.oncloseclick = () => this.ontilecloseclick(tile.id);
		tile.onrangechange = () => this.ontilerangechange(tile.id, tile.threshold);

		this.tiles.push(tile);
	}

	public removeTile(id: number) {
		const tileIdx = this.tiles.findIndex((tile: Tile) => tile.id === id);
		const tile = this.tiles.splice(tileIdx, 1)[0];
		tile.destroy();
	}

	public updateTileAmount(tileId: number, amount: number): void {
		const tile = this.tiles.find((tile: Tile) => tile.id === tileId);
		tile.amount = amount;
	}

	public updateOtherTilesThreshold(tileId: number, deltaThreshold: number): void {
		const tileIndex = this.tiles.findIndex((tile: Tile) => tile.id === tileId);
		const len = this.tiles.length;
		let doneLeft = false, idxLeft: number,
			doneRight = false, idxRight: number,
			pos = 1;

		while(!(doneLeft && doneRight)) {
			idxLeft = tileIndex - pos;
			idxRight = tileIndex + pos;

			if (idxLeft >= 0) { // updates ranges on the left
				this.tiles[idxLeft].threshold = doSomeMagic(
					this.tiles[idxLeft].threshold, 
					deltaThreshold, 
					pos
				);
			} else {
				doneLeft = true;
			}

			if (idxRight < len) { // updates ranges on the right
				this.tiles[idxRight].threshold = doSomeMagic(
					this.tiles[idxRight].threshold, 
					deltaThreshold, 
					pos
				);
			} else {
				doneRight = true;
			}

			pos++;
		}
	}

	public destroy(): void {
		for (let tile of this.tiles) {
			tile.destroy();
		}
		this.clickSubscription.unsubscribe();
	}

}