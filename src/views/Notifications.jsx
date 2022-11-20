import React from 'react';
import {callAuthenticated} from '../helpers/apiHelper';
import Post from '../components/Post';
import AppText from '../components/styled/AppText';
import TopBar from '../components/TopBar';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import {FlatList} from 'react-native';
import PropTypes from 'prop-types';
import FollowRequestNotification from '../components/notificationTypes/FollowRequestNotification';
import StatusNotification from '../components/notificationTypes/StatusNotification';
import FavouriteNotification from '../components/notificationTypes/FavouriteNotification';
import ReblogNotification from '../components/notificationTypes/ReblogNotification';
import FollowNotification from '../components/notificationTypes/FollowNotification';
import PollFinishedNotification from '../components/notificationTypes/PollFinishedNotification';
import MentionNotification from '../components/notificationTypes/MentionNotification';
import EditNotification from '../components/notificationTypes/EditNotification';
import SignUpNotification from '../components/notificationTypes/SignUpNotification';
import ReportNotification from '../components/notificationTypes/ReportNotification';

const Notifications = (props) => {
    const {instanceInfo, notifications, setNotifications, oauthToken, setPosts, account} = props;
    const [refreshing, setRefreshing] = React.useState(true);

    React.useEffect(() => {
        if (notifications.length === 0) {
            fetchAndSetNotifications('/api/v1/notifications');
        } else {
            setRefreshing(false);
        }
    }, []);

    const fetchAndSetNotifications = (route, refresh = false) => {
        setRefreshing(true);
        return callAuthenticated(instanceInfo.uri, route, 'GET', oauthToken)
            .then((fetchedNotifications) => {
                if (!Array.isArray(fetchedNotifications)) {
                    console.warn('Received notifications array that was not actually an array', fetchedNotifications);
                    throw new Error('Fetched notifications are not an array');
                }

                if (refresh) {
                    setNotifications(fetchedNotifications);
                } else {
                    setNotifications([...fetchedNotifications, ...notifications].sort((a, b) => a.id > b.id ? -1 : 1));
                }
            })
            .catch((reason) => {
                console.error('Notification fetching failed', reason);
            })
            .finally(() => {
                setRefreshing(false);
            });
    };

    const renderItem = ({item}) => {
        if (item.type === 'follow_request') {
            return <FollowRequestNotification notification={item}/>;
        } else if (item.type === 'follow') {
            return <FollowNotification notification={item}/>;
        } else if (item.type === 'admin.sign_up') {
            return <SignUpNotification notification={item}/>;
        } else if (item.type === 'admin.report') {
            return <ReportNotification/>;
        } else if (item.status) {
            let info = '';
            const post = <Post post={item.status}
                               instanceInfo={instanceInfo}
                               setPosts={setPosts}
                               oauthToken={oauthToken}
                               hideNonExistWaning={true}/>;
            if (item.type === 'status') {
                info = <StatusNotification notification={item}/>;
            } else if (item.type === 'favourite') {
                info = <FavouriteNotification notification={item}/>;
            } else if (item.type === 'reblog') {
                info = <ReblogNotification notification={item}/>;
            } else if (item.type === 'poll') {
                info = <PollFinishedNotification notification={item}/>;
            } else if (item.type === 'mention') {
                info = <MentionNotification notification={item}/>;
            } else if (item.type === 'update') {
                info = <EditNotification notification={item}/>;
            }

            return <>
                {info}
                {post}
            </>;
        } else {
            return <AppText>
                Unknown notification type: {'\n'}
                {JSON.stringify(item)}
            </AppText>;
        }
    };

    const handleRefresh = () => {
        fetchAndSetNotifications('/api/v1/notifications', true);
    };

    const handleLoadMore = () => {
        let route = '/api/v1/notifications';

        const lastId = notifications[notifications.length - 1].id;
        if (lastId) {
            route += '?max_id=' + lastId;
        }

        fetchAndSetNotifications(route, false);
    };

    return <>
        <TopBar title="Notifications"
                subTitle={account.acct}
                Icon={<MaterialIcon size={50} name="notifications" style={{color: 'white'}}/>}
                SubMenu={<></>}/>
        <FlatList data={notifications}
                  renderItem={renderItem}
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  onEndReached={handleLoadMore}
                  onEndReachedThreshold={0.7}
                  keyExtractor={(notification) => notification.id}
                  ListEmptyComponent={<AppText>No notifications found</AppText>}/>
    </>;
};

Notifications.propTypes = {
    instanceInfo: PropTypes.object.isRequired,
    notifications: PropTypes.array.isRequired,
    setNotifications: PropTypes.func.isRequired,
    oauthToken: PropTypes.string.isRequired,
    setPosts: PropTypes.func.isRequired,
};

export default Notifications;
