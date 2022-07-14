import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(5.5px);
    -webkit-backdrop-filter: blur(5.5px);
    border-radius: 10px;
    margin: 30vh auto;
    padding: .7em;
    max-width: 40em;
`;

const Header = styled.span`
    font-size: 2.5em;
`;

const Text = styled.span`
    font-size: 1.2em;
`;

function NotSupportMobile() {
    return (
        <Container>
            <Header>Sorry.</Header> <br/>
            <Text>This browser does not support our service. Please use our service with supported browsers.</Text>
        </Container>
    );
}

export default NotSupportMobile;
