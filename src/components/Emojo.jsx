import React from 'react';
import styled from 'styled-components/native';


const EmojoImage = styled.Image`
  /* TODO Font size from device config! */
  height: 18px;
  width: 18px;
`

const Emojo = (props) => {
    return <EmojoImage source={{uri: props.src}} accessibilityLabel={props.alt}/>
}

export default Emojo;
