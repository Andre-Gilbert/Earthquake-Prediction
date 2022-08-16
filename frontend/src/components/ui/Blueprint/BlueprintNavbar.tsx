import { Alignment, Button, Navbar } from '@blueprintjs/core';

export const BlueprintNavbar = () => {
    return (
        <Navbar>
            <Navbar.Group align={Alignment.LEFT}>
                <Navbar.Heading>Earthquake Prediction</Navbar.Heading>
                <Button icon="home" text="Home" minimal />
                <Button icon="document" text="Files" minimal />
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                <Button icon="user" minimal />
            </Navbar.Group>
        </Navbar>
    );
};
