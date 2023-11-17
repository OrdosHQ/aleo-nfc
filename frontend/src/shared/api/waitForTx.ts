import { AleoNetworkClient } from "@aleohq/sdk";

export const waitForTx = async (txId: string) => {
    const { tx, interval } = await new Promise<{
        tx: any;
        interval: NodeJS.Timer;
    }>((resolve) => {
        const interval = setInterval(async () => {
            try {
                const client = new AleoNetworkClient(
                    'https://api.explorer.aleo.org/v1',
                );

                const tx = await client
                    .getTransaction(txId)
                    .then((response) => response)
                    .catch(() => null);

                if (tx) {
                    resolve({ tx, interval });
                }
            } catch {}
        }, 5000);
    });

    clearInterval(interval);

    return tx;
};