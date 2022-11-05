import React from 'react';
import styled from 'styled-components/native';
import {ConfigurationProvider} from './src/data/ConfigurationContext';
import Root from './src/views/Root';

const MainView = styled.View`
  background-color: black;
  color: white;
`;

export default function App() {
    return (
        <MainView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ConfigurationProvider>
                <Root/>
            </ConfigurationProvider>
        </MainView>
    );
}
