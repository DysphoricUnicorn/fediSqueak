import AppText from '../components/AppText';
import {Button} from 'react-native';
import styled from 'styled-components/native';
import {callApi} from '../helpers/apiHelper';
import PropTypes from 'prop-types';
import {decodeHtmlEntities} from '../helpers/generalHelpers';

const InstanceLogo = styled.Image`
  width: 50px;
  height: 50px;
`;

const Login = (props) => {
    const {instance, instanceInfo, setInstanceInfo, setRegisteredApp} = props;

    const logIn = () => {
        callApi(instance, '/api/v1/apps', 'POST', {client_name: 'FediSqueak', redirect_uris: 'urn:ietf:wg:oauth:2.0:oob'})
            .then((registeredApplication) => {
                setRegisteredApp({registered: true, ...registeredApplication});
            })
            .catch((error) => console.log(error));
    };

    return <>
        <InstanceLogo source={{uri: instanceInfo.thumbnail}}/>
        <AppText>{instanceInfo.title}</AppText>
        <AppText/>
        <AppText>{decodeHtmlEntities(instanceInfo.description)}</AppText>
        <AppText/>
        <Button onPress={() => setInstanceInfo({fetched: false})} title="Use different instance"/>
        <Button onPress={logIn} title="Log in"/>
    </>;
};

Login.propTypes = {
    instance: PropTypes.string.isRequired,
    instanceInfo: PropTypes.object.isRequired,
    setInstance: PropTypes.func.isRequired,
    setInstanceInfo: PropTypes.func.isRequired,
    setRegisteredApp: PropTypes.func.isRequired,
};

export default Login;
