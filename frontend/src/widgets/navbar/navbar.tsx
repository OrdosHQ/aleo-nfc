import { FC } from 'react';
import {
    Navbar as NextNavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    User,
} from '@nextui-org/react';
import { useUserStore } from '../../entities/user';
import { useAuthFeatureStore } from '../../features/auth';

export const Navbar: FC = () => {
    const { aleo, twitter } = useUserStore((store) => store);
    const { auth } = useAuthFeatureStore();

    return (
        <NextNavbar>
            <NavbarContent className="sm:hidden pr-3" justify="start">
                <NavbarBrand>
                    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
                        <path
                            clip-rule="evenodd"
                            d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
                            fill="currentColor"
                            fill-rule="evenodd"
                        ></path>
                    </svg>
                    <p className="font-bold text-inherit">ACME</p>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    <Link href="#">Login</Link>
                </NavbarItem>
                <NavbarItem>
                    {aleo && twitter ? (
                        <User
                            name={twitter.displayName}
                            description={
                                `${aleo.address.slice(
                                    0,
                                    5,
                                )}...${aleo.address.slice(
                                    aleo.address.length - 6,
                                )}`
                                // <Link
                                //     href="https://twitter.com/jrgarciadev"
                                //     size="sm"
                                //     isExternal
                                // >
                                //     @jrgarciadev
                                // </Link>
                            }
                            avatarProps={{
                                src: twitter.photoUrl,
                            }}
                        />
                    ) : (
                        <Button
                            onPress={auth}
                            as={Link}
                            color="warning"
                            href="#"
                            variant="flat"
                        >
                            Sign in
                        </Button>
                    )}
                </NavbarItem>
            </NavbarContent>
        </NextNavbar>
    );
};
