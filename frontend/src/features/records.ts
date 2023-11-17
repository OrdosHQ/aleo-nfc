import { create } from 'zustand';
import axios from 'axios';
import { useUserStore } from '../entities/user';

const fetchRecords = async (token: string) => {
    return await axios.get(`https://aleo-nfc-back-g6lgu.ondigitalocean.app/user/records`, {
        headers: {
            Authorization: token
        }
    }).then((response) => response.data);
};

interface IMintFeatureStore {
    fetchRecords: () => void;
}

export const useRecordsFeatureStore = create<IMintFeatureStore>((set, get) => ({
    fetchRecords: async () => {
        const { twitter } = useUserStore.getState()

        const {records = []} = await fetchRecords(twitter.token)

        useUserStore.setState({ nfcItems: records })
    },
}));
