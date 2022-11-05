import React from 'react';
import AppText from '../components/AppText';
import PropTypes from 'prop-types';
import {callAuthenticated} from '../helpers/apiHelper';
import AccountImage from '../components/AccountImage';

const Timeline = (props) => {
    const {oauthToken, instanceInfo} = props;
    const [account, setAccount] = React.useState();

    React.useEffect(() => {
        callAuthenticated(instanceInfo.uri, '/api/v1/accounts/verify_credentials', 'GET', oauthToken).then((result) => {
            setAccount(result);
        }).catch(async (reason) => {
            console.log(await reason.json());
        });
    }, []);

    if (!account) {
        return <AppText>Fetching account...</AppText>;
    }

    return <>
        <AccountImage source={{uri: account.avatar}}/>
        <AppText>Welcome {account.display_name}!</AppText>
    </>

};

Timeline.propTypes = {
    oauthToken: PropTypes.string.isRequired,
    instanceInfo: PropTypes.object.isRequired,
};

export default Timeline;
