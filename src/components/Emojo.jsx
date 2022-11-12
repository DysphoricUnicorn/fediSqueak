import React from 'react';
import styled from 'styled-components/native';
import HTMLStyleImage from './HTMLStyleImage';

const EmojoImage = styled(HTMLStyleImage)`
  /* TODO Font size from device config! */
  height: 18px;
  width: 18px;
`

const Emojo = (props) => {
    return <EmojoImage src={props.src} alt={props.alt}/>
}

export default Emojo;
