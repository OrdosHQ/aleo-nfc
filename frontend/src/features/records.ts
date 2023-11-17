import { create } from 'zustand';
import axios from 'axios';
import { useUserStore } from '../entities/user';
import { Account, AleoNetworkClient, NetworkRecordProvider } from '@aleohq/sdk';

const fetchRecords = async (token: string) => {
    return await axios
        .get(`https://aleo-nfc-back-g6lgu.ondigitalocean.app/user/records`, {
            headers: {
                Authorization: token,
            },
        })
        .then((response) => response.data);
};

export const getObjectValueByKey = (key: string, object: string) => {
    const regex = new RegExp(`${key}:\\s*(\\d+)u\\d+`);
    const result = object.match(regex);

    return result ? result[1] : null;
};

interface IMintFeatureStore {
    fetchRecords: () => void;
}

export const useRecordsFeatureStore = create<IMintFeatureStore>((set, get) => ({
    fetchRecords: async () => {
        try {
            const { twitter, aleo, setNfcItems } = useUserStore.getState();

            const { records = [] } = await fetchRecords(twitter.token);

            const account = new Account({ privateKey: aleo.privateKey });

            const nfcItems = records.map((record) => {
                const rec = account.decryptRecord(record.value);

                return {
                    id: getObjectValueByKey('id', rec),
                    kind: getObjectValueByKey('kind', rec),
                    fingerPrint: getObjectValueByKey('finger_print', rec),
                    contract: 'aleo_nfc_chip_v2.aleo',
                    name: 'Aleo Ball Cap',
                    image: 'https://doxxy.io/media/cache/ce/6c/ce6c988ac831107924d04610c8cf0678.jpg',
                };
            });

            setNfcItems(nfcItems);
        } catch {}
    },
}));
