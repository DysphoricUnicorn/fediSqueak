import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppText from '../components/AppText';

const Context = React.createContext({});
Context.displayName = 'ConfigurationContext';

export const ConfigurationProvider = (props) => {
    const [instance, _setInstance] = React.useState('https://fedi.dysphoric.space');
    const [instanceInfo, _setInstanceInfo] = React.useState({fetched: false});
    const [registeredApp, _setRegisteredApp] = React.useState({registered: false});
    const [oauthToken, _setOauthToken] = React.useState('');
    const [loading, setLoading] = React.useState(true);

    function updateStoredData(newInstance, newInstanceInfo, newRegisteredApp, newOauthToken) {
        const newStoredData = JSON.stringify({
            instance: newInstance,
            instanceInfo: newInstanceInfo,
            registeredApp: newRegisteredApp,

            oauthToken: newOauthToken,
        });

        return AsyncStorage.setItem('stored_data', newStoredData).catch((reason) => {
            console.warn('Could not store data', reason);
        });
    }

    function setInstance(newInstance) {
        updateStoredData(newInstance, instanceInfo, registeredApp, oauthToken).then(() => {
            _setInstance(newInstance);
        });
    }

    function setInstanceInfo(newInstanceInfo) {
        updateStoredData(instance, newInstanceInfo, registeredApp, oauthToken).then(() => {
            _setInstanceInfo(newInstanceInfo);
        });
    }

    function setRegisteredApp(newRegisteredApp) {
        updateStoredData(instance, instanceInfo, newRegisteredApp, oauthToken).then(() => {
            _setRegisteredApp(newRegisteredApp);
        });
    }

    function setOauthToken(newOauthToken) {
        updateStoredData(instance, instanceInfo, registeredApp, newOauthToken).then(() => {
            _setOauthToken(newOauthToken);
        });
    }

    React.useEffect(() => {
        AsyncStorage.getItem('stored_data')
            .then((data) => {
                const json = JSON.parse(data);
                if (json?.instance && json?.instanceInfo && json?.registeredApp && json?.oauthToken) {
                    _setInstance(json.instance);
                    _setInstanceInfo(json.instanceInfo);
                    _setRegisteredApp(json.registeredApp);
                    _setOauthToken(json.oauthToken);
                } else {
                    console.log(Boolean(json?.instance), Boolean(json?.instanceInfo), Boolean(json?.registeredApp), Boolean(json?.oauthToken));
                    return Promise.reject('stored data missing field(s)');
                }
            })
            .catch((reason) => {
                console.log('Reading stored data failed', reason);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const value = {
        instance,
        setInstance,
        instanceInfo,
        setInstanceInfo,
        registeredApp,
        setRegisteredApp,
        oauthToken,
        setOauthToken,
    };

    return <Context.Provider value={value}>{loading ? <AppText>Loading app...</AppText> : props.children}</Context.Provider>;
};

export function useConfigurationContext() {
    const data = React.useContext(Context);
    if (Object.keys(data).length === 0) {
        throw new Error('Attempted to use configuration context outside of a provider.');
    }
    return data;
}
