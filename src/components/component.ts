abstract class Component {

	protected container: HTMLElement;
	protected el: HTMLElement;

	constructor(container: HTMLElement) {
		this.container = container;
	}

	public get element(): HTMLElement {
		return this.el;
	}

	public findElement(selector: string): HTMLElement {
		const root = this.el || this.container;
		return <HTMLElement>root.querySelector(selector);
	}

	public remove(): void {
		this.container.removeChild(this.el);
	}

	protected abstract buildDOM(): void;
	public abstract destroy(): void;

	// only works if there is one root element
	// todo: createDocumentFragment instead?
	public static string2Element(strHtml: string): HTMLElement {
		let div = document.createElement('div');
		div.innerHTML = strHtml.trim();
		return <HTMLElement>div.firstChild;
	}
}

export default Component;
