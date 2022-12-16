import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Switch, View} from 'react-native';
import AppText from '../components/styled/AppText';
import TopBar from '../components/TopBar';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import styled from 'styled-components/native';

const Settings = (props) => {
    const [clearing, setClearing] = React.useState(false);
    const {setPosts, appSettings, setAppSettings} = props;

    const [cachedScrollTopWarn, setCachedScrollTopWarn] = React.useState(appSettings.scrollTopWarn ?? true);

    const handleScrollTopWarnChange = () => {
        setAppSettings({...appSettings, scrollTopWarn: !cachedScrollTopWarn});
        setCachedScrollTopWarn(!cachedScrollTopWarn);
    };

    const deleteCache = () => {
        setClearing(true);
        AsyncStorage.setItem('postshome', '[]')
            .then(() => AsyncStorage.setItem('postslocal', '[]'))
            .then(() => AsyncStorage.setItem('postsfederated', '[]'))
            .then(() => setPosts([]))
            .catch(reason => console.error('Cache clearing failed', reason))
            .finally(() => setClearing(false));
    };

    return <>
        <TopBar title="Settings" subTitle="" Icon={<MaterialIcon size={50} name="settings" style={{color: 'white'}}/>} SubMenu={<></>}/>
        <Button title="Clear cache" onPress={deleteCache} disabled={clearing}/>
        <SettingsSwitchesContainer>
            <SettingsSwitchTextContainer>
                <AppText>Warn before scrolling to top when hitting bottom navigation buttons</AppText>
            </SettingsSwitchTextContainer>
            <SettingsSwitchSwitchContainer>
                <Switch value={cachedScrollTopWarn} onValueChange={handleScrollTopWarnChange}/>
            </SettingsSwitchSwitchContainer>
        </SettingsSwitchesContainer>
    </>;
};

const SettingsSwitchesContainer = styled.View`
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
`;

const SettingsSwitchTextContainer = styled.View`
    width: 80%;
`;

const SettingsSwitchSwitchContainer = styled.View` 
    width: 20%;
`;

export default Settings;
