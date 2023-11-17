import { create } from 'zustand';
import { useUserStore } from '../entities/user';
import axios from 'axios';
import { workerClient } from '../app/providers/workerClient';
import { waitForTx } from '../shared/api/waitForTx';
import { Account } from '@aleohq/sdk';
import { getObjectValueByKey } from './records';

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
    return await axios
        .post(
            `https://aleo-nfc-back-g6lgu.ondigitalocean.app/user/record`,
            { id: txId },
            {
                headers: {
                    Authorization: token,
                },
            },
        )
        .then((res) => res.data);
};

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

            const { i } = await new Promise<{ i: NodeJS.Timeout }>(
                (resolve) => {
                    const i = setInterval(() => {
                        if (useUserStore.getState().isFauceted) {
                            resolve({ i });
                        }
                    }, 1000);
                },
            );

            clearInterval(i);

            const { data: transactionId } = await workerClient.mint({
                nfcData,
                aleo,
            });

            console.log(transactionId, 'worker mint');
            const tx = await waitForTx(transactionId);
            console.log(tx, 'tx');
            const record = await addRecord(transactionId, twitter.token);

            const account = new Account({ privateKey: aleo.privateKey });
            const rec = account.decryptRecord(record.value);

            addNfcItem({
                id: getObjectValueByKey('id', rec),
                kind: getObjectValueByKey('kind', rec),
                fingerPrint: getObjectValueByKey('finger_print', rec),
                contract: 'aleo_nfc_chip_v2.aleo',
                name: 'Aleo Ball Cap',
                image: 'https://doxxy.io/media/cache/ce/6c/ce6c988ac831107924d04610c8cf0678.jpg',
            });
        } catch (err) {
            console.log(err as any);
        } finally {
        }
    },
}));
