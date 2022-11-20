import React from 'react';
import {Image, View} from 'react-native';
import AppText from './styled/AppText';
import PropTypes from 'prop-types';
// TODO: replace image with FastImage once I've got a MacOS build system up and running

const HTMLStyleImage = (props) => {
    const [error, setError] = React.useState(false);

    if (error) {
        return <View style={props.style}>
            <AppText>
                Image failed loading:{'\n'}
                {props.alt}
            </AppText>
        </View>;
    }

    return <Image source={{uri: props.src}}
                  onError={() => setError(true)}
                  accessibilityLabel={props.alt}
                  accessible
                  resizeMode="contain"
                  style={props.style}/>;
};

HTMLStyleImage.propTypes = {
    style: PropTypes.any,
    alt: PropTypes.string,
    src: PropTypes.string.isRequired,
};

export default HTMLStyleImage;
