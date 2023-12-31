
export class ZkAppWorkerClient {
    private worker: Worker;

    private promises: {
        [id: number]: {
            resolve: (res: unknown) => void;
            reject: (err: unknown) => void;
        };
    };

    private nextId: number;

    constructor() {
        this.worker = new Worker(new URL("./worker.ts", import.meta.url), {
            type: "module",
        });

        this.promises = {};
        this.nextId = 0;

        this.worker.onmessage = (event: MessageEvent < any > ) => {
            this.promises[event.data.id].resolve(event.data.data);
            delete this.promises[event.data.id];
        };
    }

    private call(fn: any, args: unknown) {
        return new Promise((resolve, reject) => {
            this.promises[this.nextId] = {
                resolve,
                reject
            };

            const message: any = {
                id: this.nextId,
                fn,
                args,
            };

            this.worker.postMessage(message);

            this.nextId++;
        });
    }

    async mint(args: any) {
        const message: any = {
            id: this.nextId,
            fn: "mint",
            args,
        };
        
        this.worker.postMessage(message);

        return await new Promise<{ data: string }>((resolve) => {
            this.worker.onmessage = (event: MessageEvent < any > ) => {
                resolve(event.data)
            };
        })
    }
}

export const workerClient = new ZkAppWorkerClient();