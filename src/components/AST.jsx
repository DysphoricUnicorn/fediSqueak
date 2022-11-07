import AppText from './AppText';
import React from 'react';
import styled from 'styled-components/native';
import {Linking, Text} from 'react-native';

export const PostText = styled(AppText)`
  font-size: 18px;
`;

const ParagraphOuter = styled.View`
  margin-top: 5px;
  margin-bottom: 5px;
  color: white;
  flex-direction: row;
  flex-wrap: wrap;
`;

const Paragraph = (props) => {
    return <ParagraphOuter>
        <Text>{props.children}</Text>
    </ParagraphOuter>
}

const Italic = styled(PostText)`
  font-style: italic;
`;

const Bold = styled(PostText)`
  font-weight: bold;
`;

const ColoredLink = styled(PostText)`
  color: #ff00ff;
`;

const Link = (props) => {
    const handleLinkPress = () => {
        Linking.openURL(props.href).catch((reason) => console.error('could not open link', reason));
    };

    if (props?.href) {
        return <ColoredLink onPress={handleLinkPress}>
            {props.children}
        </ColoredLink>;
    }

    return props.children;
};

const lookupHtmlTagReactNativeEquivalent = (tagName) => {
    switch (tagName) {
        case('p'):
            return [Paragraph, false];
        case('i'):
            return [Italic, false];
        case('b'):
            return [Bold, false];
        case('a'):
            return [Link, true];
        default:
            return [React.Fragment, false];
    }
};

const AST = (props) => {
    const {parsed} = props;
    if (parsed.type === 'text') {
        const Tag = props.childOfA ? ColoredLink : PostText;
        return <Tag>{parsed.content}</Tag>;
    }

    const [Tag, allowsAttributes] = lookupHtmlTagReactNativeEquivalent(parsed.name);

    if (!parsed.children) {
        return '\n';
    }

    const tagProps = allowsAttributes ? parsed.attrs : {};
    const childOfA = props.childOfA || parsed.name === 'a'

    return <Tag {...tagProps}>
        {parsed.children.map((child, index) => <React.Fragment key={index}>
            <AST parsed={child} childOfA={childOfA}/>
        </React.Fragment>)}
    </Tag>;
};

export default AST;
