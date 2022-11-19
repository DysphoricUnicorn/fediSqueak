import React from 'react';
import AppText from '../components/AppText';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import TopBar from '../components/TopBar';
import {Menu, MenuOption, MenuOptions, MenuTrigger, renderers} from 'react-native-popup-menu';
import CenteredAppText from '../components/CenteredAppText';
import CenteredMaterialIcon from '../components/CenteredMaterialIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {callAuthenticated} from '../helpers/apiHelper';
import {Button, FlatList} from 'react-native';
import Post from '../components/Post';
import {getPostHeight, getPostOffset} from '../helpers/postHelpers';

const OwnProfileImage = styled.Image`
  height: 50px;
  width: 50px;
`;

const Timeline = (props) => {
    const {
        account,
        oauthToken,
        instanceInfo,
        posts,
        setPosts,
        timelineScrollPosition,
        setTimelineScrollPosition,
        currentTl,
        setCurrentTl,
    } = props;

    const [refreshing, setRefreshing] = React.useState(true);
    const [loadingMore, setLoadingMore] = React.useState(true);
    const [previousLast, setPreviousLast] = React.useState();

    const tlScroll = React.useRef();

    React.useEffect(() => {
        AsyncStorage.getItem('previousLast' + currentTl).then((item) => setPreviousLast(item));
    }, [currentTl]);

    React.useEffect(() => {
        if (posts.length === 0) {
            AsyncStorage.getItem('posts' + currentTl).then((oldPosts) => {
                if (oldPosts) {
                    setPosts(JSON.parse(oldPosts), false);
                } else {
                    return Promise.reject();
                }
            }).catch(() => {
                callAuthenticated(instanceInfo.uri, '/api/v1/timelines/home?limit=20', 'GET', oauthToken)
                    .then((newPosts) => {
                        if (newPosts) {
                            setPosts(newPosts);
                        } else {
                            return Promise.reject('No posts returned');
                        }
                    })
                    .catch((reason) => {
                        console.warn('Could not fetch posts', reason);
                    });
            }).finally(() => {
                setRefreshing(false);
                setLoadingMore(false);
            });
        } else {
            setRefreshing(false);
            // We need to push the scrollToOffset call to the bottom of the execution stack to avoid a race condition when the TL is there but not rendered yet
            window.setTimeout(() => tlScroll.current?.scrollToOffset({offset: timelineScrollPosition.current, animated: false}), 0)
            ;
        }
    }, []);

    const fetchAndSetPosts = (route) => {
        callAuthenticated(instanceInfo.uri, route, 'GET', oauthToken)
            .then((fetchedPosts) => {
                const newPosts = [...fetchedPosts, ...posts].sort((a, b) => a.id > b.id ? -1 : 1);
                const newPreviousLastId = fetchedPosts[fetchedPosts.length - 1]?.id;
                setPreviousLast(newPreviousLastId);
                if (newPreviousLastId) {
                    AsyncStorage.setItem('previousLast' + currentTl, fetchedPosts[fetchedPosts.length - 1]?.id).catch((reason => {
                        console.error('Could not set previousLast', reason);
                    }));
                } else {
                    AsyncStorage.removeItem('previousLast' + currentTl)
                        .catch((reason => console.error('could not remote previousLast', reason)));
                }
                setPosts(newPosts);
            })
            .catch((reason) => {
                console.error('Post fetching failed', reason);
            })
            .finally(() => {
                setRefreshing(false);
                setLoadingMore(false);
            });
    };

    const handleRefresh = () => {
        setRefreshing(true);
        let route = '/api/v1/timelines/home?limit=20';
        if (posts[0]) {
            route += '&since_id=' + posts[0].id;
        }
        fetchAndSetPosts(route);
    };

    const handleLoadMore = (last, next) => {
        setLoadingMore(true);
        let route = '/api/v1/timelines/home?limit=20';

        if (last) {
            route += '&max_id=' + last;
            if (next) {
                route += '&min_id=' + next;
            }
        } else if (posts.length > 0) {
            route += '&max_id=' + posts[posts.length - 1].id;
        }
        fetchAndSetPosts(route);
    };

    if (!account) {
        return <AppText>Fetching account...</AppText>;
    }

    const renderPost = ({item, index}) => {
        const post = item;
        const renderPost = <Post post={post}
                                 instanceInfo={instanceInfo}
                                 oauthToken={oauthToken}
                                 setPosts={setPosts}/>;
        if (post.id === previousLast && index !== posts.length - 1) {
            return <React.Fragment>
                {renderPost}
                <Button title="Load more" onPress={() => handleLoadMore(post.id, sortedPosts?.[index + 1]?.id)}
                        disabled={loadingMore}/>
            </React.Fragment>;
        }
        return renderPost;
    };

    const getItemLayout = (data, index) => {
        return {length: getPostHeight(data, index), offset: getPostOffset(data, index), index};
    };

    const handleScroll = (e) => {
        setTimelineScrollPosition(e.nativeEvent.contentOffset.y);
    };

    const sortedPosts = posts.sort((a, b) => a.created_at > b.created_at ? -1 : 1);
    return <>
        <TopBar title={currentTl}
                subTitle={account.acct}
                Icon={<OwnProfileImage source={{uri: account.avatar}}/>}
                SubMenu={<TimelineSubMenu currentTl={currentTl} setCurrentTl={setCurrentTl}/>}/>
        <FlatList renderItem={renderPost}
                  ref={ref => tlScroll.current = ref}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                  data={posts}
                  keyExtractor={post => post.id}
                  onRefresh={handleRefresh}
                  refreshing={refreshing}
                  onEndReached={() => handleLoadMore()}
                  onEndReachedThreshold={0.7}
                  scrollsToTop={false}
                  getItemLayout={getItemLayout}
                  ListEmptyComponent={<Button title="Load posts" onPress={() => handleLoadMore()} disabled={loadingMore}/>}/>
    </>;
};

Timeline.propTypes = {
    account: PropTypes.object,
    oauthToken: PropTypes.string.isRequired,
    instanceInfo: PropTypes.object.isRequired,
};

const TimelineMenuOptionText = styled(AppText)`
  color: ${props => props.active ? '#ff00ff' : 'black'};
  padding: 10px;
  font-size: 25px;
`;

const TimelineSubMenu = (props) => {
    const {currentTl, setCurrentTl} = props;

    return <Menu renderer={renderers.SlideInMenu}>
        <MenuTrigger>
            <CenteredMaterialIcon color="white" size={30} name="menu"/>
            <CenteredAppText>Menu</CenteredAppText>
        </MenuTrigger>
        <MenuOptions>
            <MenuOption onSelect={() => setCurrentTl('home')}>
                <TimelineMenuOptionText active={currentTl === 'home'}>Home timeline</TimelineMenuOptionText>
            </MenuOption>
            <MenuOption onSelect={() => setCurrentTl('local')}>
                <TimelineMenuOptionText active={currentTl === 'local'}>Local timeline</TimelineMenuOptionText>
            </MenuOption>
            <MenuOption onSelect={() => setCurrentTl('federated')}>
                <TimelineMenuOptionText active={currentTl === 'federated'}>Federated timeline</TimelineMenuOptionText>
            </MenuOption>
        </MenuOptions>
    </Menu>;
};

export default Timeline;
