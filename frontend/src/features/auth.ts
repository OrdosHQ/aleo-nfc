import { Account } from '@aleohq/sdk';
import { create } from 'zustand';
import { AleoStruct } from '../shared/types';
import { useUserStore } from '../entities/user';
import axios from 'axios';
import { waitForDebugger } from 'inspector';
import { waitForTx } from '../shared/api/waitForTx';

const faucet = async (address: string) => {
    return await axios
        .get(`http://167.172.171.122/faucet?address=${address}&amount=1000000`)
        .then((response) => response.data);
};

interface IAuthFeatureStore {
    auth: () => void;
    addUser: (twitter: any) => void;
    faucet: (address: string) => void;
}

export const useAuthFeatureStore = create<IAuthFeatureStore>((set, get) => ({
    auth: () => {
        window.open(
            'https://aleo-nfc-back-g6lgu.ondigitalocean.app/auth/twitter',
        );
    },
    faucet: async (address: string) => {
        const response = await faucet(address);

        await waitForTx(response.transactionId);

        const { fauceted } = useUserStore.getState();

        fauceted();
    },
    addUser: (twitter: any) => {
        const { setAccount } = useUserStore.getState();

        const account = new Account();

        const aleo: AleoStruct = {
            privateKey: account.privateKey().to_string(),
            address: account.address().to_string(),
            viewKey: account.viewKey().to_string(),
        };

        const { faucet } = get();

        faucet(aleo.address);

        setAccount({
            aleo,
            twitter,
        });
    },
}));
