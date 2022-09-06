/** The earthquake prediction app navbar. */
import Profile from '@assets/profile.svg';
import {
    Alignment,
    AnchorButton,
    Button,
    Classes,
    Drawer,
    DrawerSize,
    Intent,
    Menu,
    MenuDivider,
    Navbar,
    Position,
} from '@blueprintjs/core';
import { MenuItem2, Popover2 } from '@blueprintjs/popover2';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from './BlueprintNavbar.module.scss';

export const BlueprintNavbar = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    return (
        <Navbar fixedToTop>
            <Navbar.Group align={Alignment.LEFT}>
                <MobileDrawer />
                <Navbar.Heading className={styles.title}>Earthquake Prediction</Navbar.Heading>
                <Link href="/dashboard" passHref>
                    <AnchorButton
                        className={styles.btn}
                        type="button"
                        icon="geolocation"
                        text="Overview"
                        intent={router.pathname === '/dashboard' ? Intent.PRIMARY : Intent.NONE}
                        minimal
                    />
                </Link>
                <Link href="/earthquakes" passHref>
                    <AnchorButton
                        className={styles.btn}
                        type="button"
                        icon="globe"
                        text="Earthquakes"
                        intent={router.pathname === '/earthquakes' ? Intent.PRIMARY : Intent.NONE}
                        minimal
                    />
                </Link>
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                <Popover2
                    className={styles.popover}
                    content={<UserMenu username={session?.user?.name} />}
                    placement="bottom-end"
                >
                    <button className={styles.btnUser}>
                        <Image
                            src={status === 'authenticated' ? session?.user?.image : Profile}
                            alt="User Image"
                            width={32}
                            height={32}
                        />
                    </button>
                </Popover2>
            </Navbar.Group>
        </Navbar>
    );
};

type UserMenuProps = {
    username: string | null | undefined;
};

const UserMenu = ({ username }: UserMenuProps) => {
    const handleSignOut = () => signOut();

    return (
        <Menu>
            <MenuDivider title={`Welcome ${username}!`} />
            <MenuItem2 icon="log-out" text="Sign Out" onClick={handleSignOut} />
        </Menu>
    );
};

const MobileDrawer = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => setIsOpen(true);

    const handleClose = () => setIsOpen(false);

    return (
        <>
            <Button className={styles.menu} icon="menu" minimal onClick={handleOpen} />
            <Drawer
                isOpen={isOpen}
                onClose={handleClose}
                position={Position.LEFT}
                size={DrawerSize.SMALL}
                title="Earthquake Prediction"
            >
                <div className={Classes.DRAWER_BODY}>
                    <Link href="/dashboard" passHref>
                        <AnchorButton text="Overview" icon="geolocation" minimal onClick={handleClose} />
                    </Link>
                    <Link href="/earthquakes" passHref>
                        <AnchorButton text="Earthquakes" icon="globe" minimal onClick={handleClose} />
                    </Link>
                </div>
            </Drawer>
        </>
    );
};
