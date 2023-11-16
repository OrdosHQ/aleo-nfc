import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Image,
    Spacer,
} from '@nextui-org/react';
import { FC, useCallback, useState } from 'react';
import { useMintFeatureStore } from '../../features/mint';
import { Navigate, useNavigate } from 'react-router';

export const Mint: FC = () => {
    const { mint, nfcData } = useMintFeatureStore();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submitClickHandler = useCallback(async () => {
        try {
            setLoading(true);

            await mint();
        } finally {
            setLoading(false);

            navigate('/');
        }
    }, [mint]);

    return (
        <div>
            <Spacer y={6} />

            <h1 className="text-xl uppercase font-medium text-left">
                Mint your item
            </h1>

            <Spacer y={6} />

            {!nfcData ? (
                <Navigate to="/scan" />
            ) : (
                <Card className="py-2">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                        <p className="text-tiny uppercase font-bold">
                            Held by:
                        </p>
                        <small className="text-default-500">
                            {nfcData.contract}
                        </small>
                        <Spacer y={2} />
                        <h4 className="font-bold text-large">{nfcData.name}</h4>
                    </CardHeader>
                    <Spacer y={2} />
                    <CardBody className="overflow-visible py-2">
                        <Image
                            isBlurred
                            isZoomed
                            alt="Card background"
                            className="object-contain rounded-xl"
                            src={nfcData.image}
                        />
                    </CardBody>
                </Card>
            )}

            <Spacer y={28} />

            <Button
                isLoading={loading}
                style={{
                    position: 'fixed',
                    bottom: 40,
                    left: '1.5rem',
                    right: '1.5rem',
                }}
                color="primary"
                variant="shadow"
                onClick={submitClickHandler}
            >
                {loading ? 'Minting' : 'Mint'}
            </Button>
        </div>
    );
};
