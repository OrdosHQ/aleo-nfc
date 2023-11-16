import { Account } from '@aleohq/sdk';
import { create } from 'zustand';
import { AleoStruct } from '../shared/types';
import { useUserStore } from '../entities/user';

interface IAuthFeatureStore {
    auth: () => void;
    addUser: (twitter: any) => void;
}

export const useAuthFeatureStore = create<IAuthFeatureStore>((set) => ({
    auth: () => {
        window.open(
            'https://aleo-nfc-back-g6lgu.ondigitalocean.app/auth/twitter',
        );
    },
    addUser: (twitter: any) => {
        const { setAccount } = useUserStore.getState();

        const account = new Account({
            privateKey:
                'APrivateKey1zkp9ESxG4Qz3NtJUSRhJSjTmBqAs8H3m8KHGGHn5xxJpTDj',
        });

        const aleo: AleoStruct = {
            privateKey: account.privateKey().to_string(),
            address: account.address().to_string(),
            viewKey: account.viewKey().to_string(),
        };

        setAccount({
            aleo,
            twitter,
        });
    },
}));
