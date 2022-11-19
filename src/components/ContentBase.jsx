import React from 'react';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import Timeline from '../views/Timeline';
import styled from 'styled-components/native';
import AppText from './AppText';
import {callAuthenticated} from '../helpers/apiHelper';
import {MenuProvider} from 'react-native-popup-menu';
import Settings from '../views/Settings';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BottomBarContainer = styled.View`
  margin-top: auto;
  align-self: end;
  width: 100%;
  padding: 5px 5px 10px;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: #ff00fff0;
  backdrop-filter: blur(20px) saturate(120%) contrast(200%);
`;

const BottomBarIconPressable = styled.Pressable`
  width: 33.3333%;
  padding: 5px;
`;

const ButtonIcon = styled(MaterialIcon)`
  color: white;
  margin-left: auto;
  margin-right: auto;
`;

const BottomBarIconText = styled(AppText)`
  text-align: center;
  font-size: 20px;
`;

const MainContentView = styled.SafeAreaView`
  margin-top: 0;
`;

const BottomBarIcon = (props) => {
    const {onPress, name, children} = props;
    return <BottomBarIconPressable onPress={onPress}>
        <ButtonIcon size={20} name={name} color="white"/>
        <BottomBarIconText>{children}</BottomBarIconText>
    </BottomBarIconPressable>;
};

const ContentBase = (props) => {
    const {oauthToken, instanceInfo} = props;
    const [currentView, setCurrentView] = React.useState('home');
    const [currentTl, setCurrentTl] = React.useState('home');
    const [account, setAccount] = React.useState();
    const timelineScrollPosition = React.useRef();
    const [posts, _setPosts] = React.useState([]);

    const setPosts = (newPosts, persist = true) => {
        // Allow functions to be passed instead of a new value, just like regular react state update functions allow
        if (typeof newPosts === 'function') {
            newPosts = newPosts(posts);
        }

        _setPosts(newPosts);
        if (persist && newPosts !== undefined) {
            AsyncStorage.setItem('posts' + currentTl, JSON.stringify(newPosts)).catch((reason) => {
                console.error('Could not store posts', reason);
            });
        }
    };

    React.useEffect(() => {
        callAuthenticated(instanceInfo.uri, '/api/v1/accounts/verify_credentials', 'GET', oauthToken).then((result) => {
            setAccount(result);
        }).catch(async (reason) => {
            console.log(await reason.json());
        });
    }, []);

    return <MenuProvider>
        <MainContentView>
            {currentView === 'home' &&
                <Timeline oauthToken={oauthToken}
                          instanceInfo={instanceInfo}
                          account={account}
                          timelineScrollPosition={timelineScrollPosition}
                          setTimelineScrollPosition={(newPos) => timelineScrollPosition.current = newPos}
                          posts={posts}
                          setPosts={setPosts}
                          currentTl={currentTl}
                          setCurrentTl={setCurrentTl}/>
                || currentView === 'settings' && <Settings setPosts={_setPosts}/>}
        </MainContentView>
        <BottomBarContainer>
            <BottomBarIcon borderRadius={0} name="home" onPress={() => setCurrentView('home')}>Home</BottomBarIcon>
            <BottomBarIcon borderRadius={0} name="notifications"
                           onPress={() => setCurrentView('notifications')}>Notifications</BottomBarIcon>
            <BottomBarIcon borderRadius={0} name="settings" onPress={() => setCurrentView('settings')}>Settings</BottomBarIcon>
        </BottomBarContainer>
    </MenuProvider>;
};

export default ContentBase;
