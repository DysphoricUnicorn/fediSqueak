import AppText from './styled/AppText';
import HTMLStyleImage from './HTMLStyleImage';
import styled from 'styled-components/native';

const AttachmentImage = styled(HTMLStyleImage)`
  min-width: 45%;
  max-width: 100%;
  flex-grow: 1;
  height: ${props => props.previewHeight > 300 ? 300 : props.previewHeight}px;
`;

const Attachment = (props) => {
    const {attachment} = props;
    if (attachment.type === 'image') {
        return <AttachmentImage previewWidth={attachment.meta.small.width}
                                previewHeight={attachment.meta.small.height}
                                src={attachment.preview_url ?? attachment.url}
                                alt={attachment.description}/>;
    }
    return <AppText>Attachment type {props.type} not supported at the moment.</AppText>;
};

export default Attachment;
