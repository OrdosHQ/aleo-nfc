import { Button, Spacer } from '@nextui-org/react';
import { FC } from 'react';
import { useMintFeatureStore } from '../../features/mint';
import { useNavigate } from 'react-router';

export const Scan: FC = () => {
    const { nfcData, setNfcData } = useMintFeatureStore();
    const navigate = useNavigate();

    const scanNFC = async () => {
        setNfcData({
            id: '1264513175327376',
            contract: 'aleo_nfc_chip_v2.aleo',
            name: 'Aleo Ball Cap #258',
            image: 'https://doxxy.io/media/cache/ce/6c/ce6c988ac831107924d04610c8cf0678.jpg',
        });

        navigate('/mint');

        if ('NDEFReader' in window) {
            const ndef = new (window as any).NDEFReader();

            await ndef.scan();

            ndef.onreading = (event: any) => {
                const serialNumber = event.serialNumber;

                const id = Number(`0x${serialNumber.replaceAll(':', '')}`);

                if (nfcData && nfcData.id !== id) {
                    setNfcData({
                        id,
                        contract: 'aleo_nfc_chip_v2.aleo',
                        name: 'Aleo Ball Cap #258',
                        image: 'https://doxxy.io/media/cache/ce/6c/ce6c988ac831107924d04610c8cf0678.jpg',
                    });
                }

                navigate('/mint');
            };
        }
    };

    return (
        <div>
            <Spacer y={6} />
            <h1 className="text-xl uppercase font-medium text-left">
                Scan your item
            </h1>

            <Spacer y={12} />

            {/* <Image src={nfcImage} isBlurred /> */}
            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <svg
                    width="100%"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle
                        cx="12"
                        cy="12"
                        r="5"
                        fill="none"
                        stroke="#0070ef"
                        strokeWidth="2"
                    >
                        <animate
                            attributeName="r"
                            from="3"
                            to="10"
                            dur="2s"
                            begin="0s"
                            repeatCount="indefinite"
                        />
                        <animate
                            attributeName="opacity"
                            from="1"
                            to="0"
                            dur="2s"
                            begin="0s"
                            repeatCount="indefinite"
                        />
                    </circle>
                    <circle
                        cx="12"
                        cy="12"
                        r="5"
                        fill="none"
                        stroke="#0070ef"
                        strokeWidth="2"
                    >
                        <animate
                            attributeName="r"
                            from="3"
                            to="10"
                            dur="2s"
                            begin="0.5s"
                            repeatCount="indefinite"
                        />
                        <animate
                            attributeName="opacity"
                            from="1"
                            to="0"
                            dur="1s"
                            begin="0.5s"
                            repeatCount="indefinite"
                        />
                    </circle>
                </svg>
                <svg
                    style={{ position: 'absolute' }}
                    width="40px"
                    height="40px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M16.3 19.5002C17.4 17.2002 18 14.7002 18 12.0002C18 9.30024 17.4 6.70024 16.3 4.50024M12.7 17.8003C13.5 16.0003 14 14.0003 14 12.0003C14 10.0003 13.5 7.90034 12.7 6.10034M9.1001 16.1001C9.7001 14.8001 10.0001 13.4001 10.0001 12.0001C10.0001 10.6001 9.7001 9.10015 9.1001 7.90015M5.5 14.3003C5.8 13.6003 6 12.8003 6 12.0003C6 11.2003 5.8 10.3003 5.5 9.60034"
                        stroke="#0070ef"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </div>

            <Spacer y={48} />

            <Button
                onClick={scanNFC}
                style={{
                    position: 'fixed',
                    bottom: 40,
                    left: '1.5rem',
                    right: '1.5rem',
                }}
                color="primary"
                variant="shadow"
            >
                Scan
            </Button>
        </div>
    );
};
