/** The earthquake prediction app navbar. */
import {
    Alignment,
    AnchorButton,
    Button,
    Classes,
    Drawer,
    DrawerSize,
    Menu,
    MenuDivider,
    Navbar,
    Position,
} from '@blueprintjs/core';
import { MenuItem2 } from '@blueprintjs/popover2';
import Profile from '@images/profile.svg';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import styles from './BlueprintNavbar.module.scss';

export const BlueprintNavbar = () => {
    const { data: session, status } = useSession();
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const [userMenuIsOpen, setUserMenuIsOpen] = useState(false);

    const handleDrawerOpen = () => setDrawerIsOpen(true);

    const handleDrawerClose = () => setDrawerIsOpen(false);

    const handleUserMenuOpen = () => setUserMenuIsOpen(true);

    const handleUserMenuClose = () => setUserMenuIsOpen(false);

    return (
        <Navbar>
            <Navbar.Group align={Alignment.LEFT}>
                <Button className={styles.menu} icon="menu" minimal onClick={handleDrawerOpen} />
                <Navbar.Heading className={styles.title}>Earthquake Prediction</Navbar.Heading>
                <Link href="/dashboard" passHref>
                    <AnchorButton className={styles.btn} text="Earthquakes" icon="globe" minimal />
                </Link>
                <Link href="/alerts" passHref>
                    <AnchorButton className={styles.btn} text="Alerts" icon="warning-sign" minimal />
                </Link>
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                <button className={styles.btnUser} onClick={handleUserMenuOpen}>
                    <Image
                        src={status === 'authenticated' ? session?.user?.image : Profile}
                        alt="User Image"
                        width={32}
                        height={32}
                    />
                </button>
            </Navbar.Group>
            {drawerIsOpen && <MobileDrawer isOpen={drawerIsOpen} handleClose={handleDrawerClose} />}
            {userMenuIsOpen && <UserMenu username={session?.user?.name} handleClose={handleUserMenuClose} />}
        </Navbar>
    );
};

type UserMenuProps = {
    username: string | null | undefined;
    handleClose: () => void;
};

const UserMenu = ({ username, handleClose }: UserMenuProps) => {
    const handleSignOut = () => {
        handleClose();
        signOut();
    };

    return (
        <Menu className={`${Classes.ELEVATION_4} ${styles.userMenu}`}>
            <MenuDivider title={`Welcome ${username}!`} />
            <MenuItem2 icon="log-out" text="Sign Out" onClick={handleSignOut} />
        </Menu>
    );
};

type MobileDrawerProps = {
    isOpen: boolean;
    handleClose: () => void;
};

const MobileDrawer = ({ isOpen, handleClose }: MobileDrawerProps) => {
    return (
        <Drawer
            isOpen={isOpen}
            onClose={handleClose}
            position={Position.LEFT}
            size={DrawerSize.SMALL}
            title="Earthquake Prediction"
        >
            <div className={Classes.DRAWER_BODY}>
                <Link href="/dashboard" passHref>
                    <AnchorButton text="Earthquakes" icon="globe" minimal />
                </Link>
                <Link href="/alerts" passHref>
                    <AnchorButton text="Alerts" icon="warning-sign" minimal />
                </Link>
            </div>
        </Drawer>
    );
};
