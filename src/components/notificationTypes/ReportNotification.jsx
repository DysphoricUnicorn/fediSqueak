import React from 'react';
import NotificationInfoView from './NotificationInfoView';
import RebloggerText from '../styled/RebloggerText';

const ReportNotification = () => {
    return <NotificationInfoView>
        <RebloggerText>
            Your instance received a report. {'\n'}
            Report handling is not supported in this app yet.
        </RebloggerText>
    </NotificationInfoView>;
};

export default ReportNotification;
