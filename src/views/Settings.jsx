import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button} from 'react-native';

const Settings = () => {
    const [clearing, setClearing] = React.useState(false);

    const deleteCache = () => {
        setClearing(true);
        AsyncStorage.setItem('postshome', '[]')
            .then(() => AsyncStorage.setItem('postslocal', '[]'))
            .then(() => AsyncStorage.setItem('postsfederated', '[]'))
            .catch((reason) => console.error('Cache clearing failed', reason))
            .finally(() => setClearing(false));

    };

    return <>
        <Button title="Clear cache" onPress={deleteCache} disabled={clearing}/>
    </>;
};

export default Settings;
