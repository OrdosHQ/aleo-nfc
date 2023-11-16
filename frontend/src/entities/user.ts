import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { AleoStruct } from '../shared/types';

interface IUserStore {
    aleo: AleoStruct | null;
    twitter: any | null;
    nfcItems: any[];
    setAccount: (payload: { aleo: AleoStruct; twitter: any }) => void;
    addNfcItem: (payload: any) => void;
}

export const useUserStore = create<IUserStore>()(
    devtools(
        persist(
            (set) => ({
                aleo: null,
                twitter: null,
                nfcItems: [
                    {
                        id: '1264513175327376',
                        contract: 'aleo_nfc_chip_v2.aleo',
                        name: 'Aleo Ball Cap #258',
                        image: 'https://doxxy.io/media/cache/ce/6c/ce6c988ac831107924d04610c8cf0678.jpg',
                    },
                ],
                setAccount: (payload) =>
                    set({ aleo: payload.aleo, twitter: payload.twitter }),
                addNfcItem: (payload) =>
                    set((state) => ({
                        nfcItems: [...state.nfcItems, payload],
                    })),
            }),
            {
                name: 'user',
                storage: createJSONStorage(() => window.localStorage),
            },
        ),
    ),
);
