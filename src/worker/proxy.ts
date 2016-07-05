export default class WorkerProxy extends Worker {

	constructor(url: string) {
		super(url);
		this.onmessage(this.messageHandler.bind(this));
	}

	private messageHandler(): void {
		
	}

	public subscribeStore(listener: AppStoreListener): void {
		this.postMessage();
	}

	public stateHasChanged(): boolean {
		this.postMessage();
	}

	public stateHasNewItem(): boolean {
		this.postMessage();
	}

	public stateHasItemDeleted(): boolean {
		this.postMessage();
	}

}

// maybe a bit more configurable?
export const workerProxy = new WorkerProxy('worker.js');