import React from 'react';
import {Button, Modal, Pressable, SafeAreaView, TextInput} from 'react-native';
import AppText from './styled/AppText';
import styled from 'styled-components/native';
import SmallAppText from './styled/SmallAppText';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';

const PostCreationModal = (props) => {
    const {visible, setVisible} = props;
    const [cnText, setCnText] = React.useState('');

    return <Modal transparent={true} visible={visible} onRequestClose={() => setVisible(false)}>
        <ModalContent>
            <SafeAreaView>
                <AppText>Subject line</AppText>
                <CnInput value={cnText} onChangeText={setCnText} multiline={true}/>
                <SmallAppText>
                    Add a subject to your post to inform others about its content and allow them to avoid certain things such as
                    spoilers or potentially triggering content. This is a small thing you can do to make the fediverse friendlier :)
                </SmallAppText>
                <Button title="Cancel" onPress={() => setVisible(false)}/>
            </SafeAreaView>
        </ModalContent>
    </Modal>;
};

const ModalContent = styled.View`
    background-color: #000;
    padding: 25px;
    border-radius: 10px;
    height: 100%;
`;

const CnInput = styled.TextInput`
    border: 3px solid #1b1b1b;
    border-radius: 5px;
    padding: 2px;
    color: #fff;
    font-size: 18px;
`;

export default PostCreationModal;
