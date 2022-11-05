import AppText from '../components/AppText';
import * as AuthSession from 'expo-auth-session';
import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'react-native';

// TODO: check if that whole PKCE stuff is necessary
const WaitingForLogin = (props) => {
    const {registeredApp, instanceInfo, setInstanceInfo, setRegisteredApp, setOauthToken} = props;
    const [failure, setFailure] = React.useState(false);
    const discovery = {
        authorizationEndpoint: instanceInfo.uri + '/oauth/authorize',
        tokenEndpoint: instanceInfo.uri + '/oauth/token',
    };
    const [request, result, promptAsync] = AuthSession.useAuthRequest(
        {
            clientId: registeredApp.client_id,
            clientSecret: registeredApp.client_secret,
            redirectUri: registeredApp.redirect_uri,
            scopes: ['read', 'write'],
            usePKCE: false,
        },
        discovery,
    );

    React.useEffect(() => {
        if (request !== null) {
            promptAsync().then((response) => {
                console.log('Got auth code', response);
            }).catch((reason) => {
                console.log('login failed', reason);
                setFailure(true);
            });
        }
    }, [request]);

    React.useEffect(() => {
        if (result?.type === 'success') {

            const {code, state} = result.params;

            const tokenizeData = {
                clientId: registeredApp.client_id,
                clientSecret: registeredApp.client_secret,
                redirectUri: registeredApp.redirect_uri,
                grantType: 'authorization_code',
                code: code,
                state: state,
                usePKCE: false,
                extraParams: {
                    code_verifier: request.codeVerifier,
                    client_id: registeredApp.client_id,
                    client_secret: registeredApp.client_secret,
                },
            };

            const obj = new AuthSession.AccessTokenRequest(tokenizeData);

            const tokenRequest = AuthSession.exchangeCodeAsync(obj, discovery);

            tokenRequest.then((result) => {
                if (result?.tokenType && result?.accessToken) {
                    setOauthToken(result.tokenType + ' ' + result.accessToken);
                    return Promise.resolve();
                }
                return Promise.reject('Token type or access token undefined.');
            })
                .catch((reason) => {
                    console.log('Tokenize failed', reason, tokenizeData);
                    setFailure(true);
                });
        }
    }, [result]);

    return failure
        ? <>
            <AppText>Authentication failed.</AppText>
            <Button title="Try again" onPress={() => setRegisteredApp({registered: false})}/>
            <Button title="Try different instance" onPress={() => setInstanceInfo({fetched: false})}/>
        </>
        : <AppText>Waiting for authentication</AppText>;
};

WaitingForLogin.propTypes = {
    instanceInfo: PropTypes.object.isRequired,
    registeredApp: PropTypes.object.isRequired,
    setInstanceInfo: PropTypes.func.isRequired,
    setRegisteredApp: PropTypes.func.isRequired,
    setOauthToken: PropTypes.func.isRequired,
};

export default WaitingForLogin;
