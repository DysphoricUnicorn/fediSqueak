import React from 'react';
import styled from 'styled-components/native';
import {Linking, Text} from 'react-native';
import Emojo from './Emojo';
import PostText from './styled/PostText';
import {decodeHtmlEntities} from '../helpers/postHelpers';
import CNText from './styled/CNText';

const Paragraph = (props) => {
    return <>
        {!props.first && '\n'}
        <Text>{props.children}</Text>
    </>;
};

const Italic = styled(PostText)`
  font-style: italic;
`;

const Bold = styled(PostText)`
  font-weight: bold;
`;

const ColoredLink = styled(PostText)`
  color: #ff00ff;
`;

export const Link = (props) => {
    const handleLinkPress = () => {
        Linking.openURL(props.href)
            .catch(reason => console.error('could not open link', reason));
    };

    if (props?.href) {
        return <ColoredLink onPress={handleLinkPress}>
            {props.children}
        </ColoredLink>;
    }

    return props.children;
};

const LineBreak = () => {
    return <PostText>{'\n'}</PostText>;
};

const lookupHtmlTagReactNativeEquivalent = (tagName) => {
    switch (tagName) {
        case('p'):
            return [Paragraph, true, true];
        case('i'):
            return [Italic, false, false];
        case('b'):
            return [Bold, false, false];
        case('a'):
            return [Link, true, false];
        case('img'):
            return [Emojo, true, false];
        case('br'):
            return [LineBreak, false, false];
        default:
            return [React.Fragment, false, false];
    }
};

const AST = (props) => {
    const {parsed} = props;
    if (parsed.type === 'text') {
        const Tag = props.childOfA
            ? ColoredLink // We can (hopefully) safely assume that anything within a link is not a CN because links in CNs make no sense
            : props.cn
                ? CNText
                : PostText;
        return <Tag>{decodeHtmlEntities(parsed.content)}</Tag>;
    }

    const [Tag, allowsAttributes, caresAboutBeingFirst] = lookupHtmlTagReactNativeEquivalent(parsed.name);

    const tagProps = allowsAttributes ? parsed.attrs : {};
    if (caresAboutBeingFirst) {
        tagProps.first = props.first;
    }

    const childOfA = props.childOfA || parsed.name === 'a';

    return <Tag {...tagProps}>
        {parsed.children.map((child, index) => <React.Fragment key={index}>
            <AST parsed={child} childOfA={childOfA} first={false} cn={props.cn}/>
        </React.Fragment>)}
    </Tag>;
};

export default AST;
