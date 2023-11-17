import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { AleoStruct } from '../shared/types';

interface IUserStore {
    aleo: AleoStruct | null;
    twitter: any | null;
    nfcItems: any[];
    isFauceted: boolean;
    setAccount: (payload: { aleo: AleoStruct; twitter: any }) => void;
    addNfcItem: (payload: any) => void;
    setNfcItems: (payload: any) => void;
    fauceted: () => void;
}

export const useUserStore = create<IUserStore>()(
    devtools(
        persist(
            (set) => ({
                aleo: null,
                twitter: null,
                nfcItems: [],
                isFauceted: false,
                setAccount: (payload) =>
                    set({ aleo: payload.aleo, twitter: payload.twitter }),
                addNfcItem: (payload) =>
                    set((state) => ({
                        nfcItems: [...state.nfcItems, payload],
                    })),
                setNfcItems: (payload) =>
                    set(() => ({
                        nfcItems: payload,
                    })),
                fauceted: () => set({ isFauceted: true })
            }),
            {
                name: 'user',
                storage: createJSONStorage(() => window.localStorage),
            },
        ),
    ),
);
