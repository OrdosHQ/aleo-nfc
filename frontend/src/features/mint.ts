import { create } from 'zustand';
import { AleoStruct } from '../shared/types';
import { useUserStore } from '../entities/user';
import {
    Account,
    AleoNetworkClient,
    NetworkRecordProvider,
    ProgramManager,
    AleoKeyProvider,
    initThreadPool,
} from '@aleohq/sdk';
import axios from 'axios';
import { workerClient } from '../app/providers/workerClient';

const getField = async (id: string) => {
    return await axios
        .get(
            `https://wt6yntazy4.execute-api.us-east-1.amazonaws.com/default/aleo-hasher?names=finger_print&names=id&names=kind&types=u128&types=u128&types=u128&values=1264513175327376&values=1264513175327376&values=1`,
            {
                params: {
                    names: ['finger_print', 'id', 'kind'],
                    types: ['u128', 'u128', 'u128'],
                    values: [id, id, 1],
                },
                paramsSerializer: {
                    indexes: null,
                },
            },
        )
        .then((response) => response.data);
};

const addRecord = async (txId: string, token: string) => {
    return await axios.post(`https://aleo-nfc-back-g6lgu.ondigitalocean.app/user/record`, { id: txId}, {
        headers: {
            Authorization: token
        }
    })
}

const waitForTx = async (txId: string) => {
    const { tx, interval } = await new Promise<{ tx: any, interval: NodeJS.Timer, }>(resolve => {
        const interval = setInterval(async () => {
            try {
                const client = new AleoNetworkClient("https://api.explorer.aleo.org/v1")

                const tx = await client.getTransaction(txId).then(response => response).catch(() => null)

                if (tx) {
                    resolve({ tx, interval })
                }
            } catch {

            }
        }, 5000)
    })

    clearInterval(interval)

    return tx;
}

interface IMintFeatureStore {
    mint: () => Promise<any | Error | string | void>;
    nfcData: any;
    setNfcData: (payload: any) => void;
}

export const useMintFeatureStore = create<IMintFeatureStore>((set, get) => ({
    nfcData: null,
    setNfcData: (payload) => set({ nfcData: payload }),
    mint: async () => {
        try {
            const { nfcData } = get();
            const { aleo, addNfcItem, twitter } = useUserStore.getState();

            const { data: transactionId } = await workerClient.mint({ nfcData, aleo })
            console.log(transactionId, 'worker mint')
            const tx = await waitForTx(transactionId)
            console.log(tx, 'tx')
            const record = await addRecord(tx, twitter.token)
            console.log(record, 'add record')
            addNfcItem(record)
        } catch (err) {
            console.log(err as any);
        } finally {
        }
    },
}));
