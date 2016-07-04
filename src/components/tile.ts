import './tile.scss'
import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/operator/first'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import Component from './component'

const TILE_TMPL = `
<div class="tile">
	<a href="#" class="close">&times;</a>
	<div class="row">
		<div class="amount">
	</div>
	<div class="row">
		<input type="range" min="0" max="100" />
	</div>
</div>
`;

export default class Tile extends Component {

	public id: number;
	private warning: boolean;
	private closeEl: HTMLElement;
	private amountEl: HTMLElement;
	private rangeEl: HTMLInputElement;
	private closeSubscription: Subscription;
	private rangeSubscription: Subscription;

	constructor(container: HTMLElement, id: number) {
		super(container);
		this.id = id;
		this.buildDOM();
	}

	protected buildDOM(): void {
		this.el = Component.string2Element(TILE_TMPL);
		this.closeEl = this.findElement('.close');
		this.amountEl = this.findElement('.amount');
		this.rangeEl = <HTMLInputElement>this.findElement('input');

		this.el.id = `tile_${this.id}`;

		this.closeSubscription = Observable
			.fromEvent(this.closeEl, 'click')
			//.first() // will dispose after the first value
			.subscribe((mouseEvent: MouseEvent) => {
				mouseEvent.preventDefault();
				this.oncloseclick()
			});

		this.rangeSubscription = Observable
			.fromEvent(this.rangeEl, 'change')
			.subscribe(() => this.onrangechange());

		this.container.appendChild(this.el);
	}

	// must be set outside
	public oncloseclick(): void {}
	public onrangechange(): void {}

	private validate(amount: number): void {
		if (amount > this.threshold && !this.warning) {
			this.el.classList.add('warning');
			this.warning = true;
		} else if (amount <= this.threshold && this.warning) {
			this.el.classList.remove('warning');
			this.warning = false;
		}
	}

	public set amount(amount: number) {
		this.amountEl.textContent = typeof amount === 'undefined' ? '' : `${amount}`;
		this.validate(amount);
	}

	public get amount(): number {
		return +this.amountEl.textContent;
	}

	public set threshold(threshold: number) {
		this.rangeEl.value = `${threshold}`;
	}

	public get threshold(): number {
		return +this.rangeEl.value;
	}

	public destroy(): void {
		this.remove();
		this.closeSubscription.unsubscribe();
		this.rangeSubscription.unsubscribe();
	}

}
