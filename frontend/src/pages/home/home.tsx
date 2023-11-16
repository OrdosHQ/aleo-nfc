import { FC, useCallback } from 'react';
import { useUserStore } from '../../entities/user';
import { Button, Card, CardFooter, Image, Spacer } from '@nextui-org/react';
import { useNavigate } from 'react-router';

export const Home: FC = () => {
    const { nfcItems } = useUserStore();

    const navigate = useNavigate();

    const goToScan = useCallback(() => {
        navigate('/scan');
    }, []);

    return (
        <div>
            <Spacer y={6} />

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <h1 className="text-xl uppercase font-medium text-left">
                    Your items
                </h1>

                <Button onClick={goToScan} color="secondary" variant="ghost">
                    Scan
                </Button>
            </div>

            <Spacer y={6} />

            {nfcItems.map((item) => (
                <>
                    <HomeItem key={item.id} {...item} />
                    <Spacer y={6} />
                </>
            ))}
        </div>
    );
};

const HomeItem: FC = (props: any) => {
    return (
        <Card isFooterBlurred radius="lg" className="border-none">
            <Image
                isZoomed
                alt="Woman listing to music"
                className="object-cover"
                src={props.image}
                width={'100%'}
            />
            <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-2 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                <p className="text-normal text-white/80">{props.name}</p>
                {/* <Button
                    className="text-tiny text-white bg-black/20"
                    variant="flat"
                    color="default"
                    radius="lg"
                    size="sm"
                >
                    Notify me
                </Button> */}
            </CardFooter>
        </Card>
    );
};
