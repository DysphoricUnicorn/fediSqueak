import WaitingForLogin from './WaitingForLogin';
import Login from './Login';
import InstanceSelection from './InstanceSelection';
import {useConfigurationContext} from '../data/ConfigurationContext';
import ContentBase from '../components/ContentBase';
import React from 'react';

const Root = () => {
    const {
        instanceInfo,
        instance,
        registeredApp,
        setInstance,
        setInstanceInfo,
        setRegisteredApp,
        oauthToken,
        setOauthToken,
    } = useConfigurationContext();

    return instanceInfo.fetched
        ? registeredApp.registered
            ? oauthToken !== ''
                ? <ContentBase instanceInfo={instanceInfo} registeredApp={registeredApp} oauthToken={oauthToken}/>
                : <WaitingForLogin registeredApp={registeredApp}
                                   instanceInfo={instanceInfo}
                                   setRegisteredApp={setRegisteredApp}
                                   setInstanceInfo={setInstanceInfo}
                                   setOauthToken={setOauthToken}/>
            : <Login instance={instance}
                     instanceInfo={instanceInfo}
                     setInstance={setInstance}
                     setInstanceInfo={setInstanceInfo}
                     setRegisteredApp={setRegisteredApp}/>
        : <InstanceSelection instance={instance} setInstance={setInstance} setInstanceInfo={setInstanceInfo}/>;
};

export default Root;
