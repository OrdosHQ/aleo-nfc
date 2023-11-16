import { create } from 'zustand';
import { AleoStruct } from '../shared/types';
import { useUserStore } from '../entities/user';
import {
    Account,
    AleoNetworkClient,
    NetworkRecordProvider,
    ProgramManager,
    AleoKeyProvider,
    TransactionModel,
} from '@aleohq/sdk';
import axios from 'axios';

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

interface IMintFeatureStore {
    mint: () => Promise<TransactionModel | Error | string | void>;
    nfcData: any;
    setNfcData: (payload: any) => void;
}

export const useMintFeatureStore = create<IMintFeatureStore>((set, get) => ({
    nfcData: null,
    setNfcData: (payload) => set({ nfcData: payload }),
    mint: async () => {
        try {
            const { nfcData } = get();
            const id = nfcData.id;
            const field = await getField(id);
            const { aleo, addNfcItem } = useUserStore.getState();

            const account = new Account({
                privateKey: aleo?.privateKey,
            });
            const keyProvider = new AleoKeyProvider();
            keyProvider.useCache(true);

            const networkClient = new AleoNetworkClient(
                'https://api.explorer.aleo.org/v1',
            );

            networkClient.setAccount(account);

            const recordProvider = new NetworkRecordProvider(
                account,
                networkClient,
            );

            const programName = 'aleo_nfc_chip_v2.aleo';

            const programManager = new ProgramManager(
                'https://api.explorer.aleo.org/v1',
                keyProvider,
                recordProvider,
            );

            programManager.setAccount(account);

            const transactionId = await programManager.execute(
                programName,
                'register',
                5,
                false,
                [
                    `{finger_print: ${id}u128, id: ${id}u128, kind: 1u128}`,
                    aleo?.address as string,
                ],
            );

            if (transactionId) {
                addNfcItem(nfcData);
            }

            return transactionId;
        } catch (err) {
            console.log(err as any);
        } finally {
        }
    },
}));
