import {Button} from 'react-native';
import AppText from '../components/styled/AppText';
import InstanceInput from '../components/styled/InstanceInput';
import {callApi} from '../helpers/apiHelper';
import PropTypes from 'prop-types';
import React from 'react';

const InstanceSelection = (props) => {
    const {instance, setInstance, setInstanceInfo} = props;
    const [instanceTmp, setInstanceTmp] = React.useState(instance);

    const fetchInstanceInfo = () => {
        setInstance(instanceTmp)
        callApi(instanceTmp, '/api/v1/instance', 'GET').then(info => {
            console.log(info);
            setInstanceInfo({fetched: true, ...info});
        }).catch(err => console.log(err));
    };

    return <>
        <AppText>Which instance do you want to use?</AppText>
        <InstanceInput value={instanceTmp} onChangeText={newText => setInstanceTmp(newText)} placeholder="Instance url"
                       keyboardType="url"/>
        <Button disabled={instanceTmp === ''} title="Fetch instance info" onPress={fetchInstanceInfo}/>
    </>;
};

InstanceSelection.propTypes = {
    instance: PropTypes.string.isRequired,
    setInstance: PropTypes.func.isRequired,
    setInstanceInfo: PropTypes.func.isRequired,
}

export default InstanceSelection;
