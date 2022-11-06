import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import CenteredAppText from './CenteredAppText';

const TopBarContainer = styled.View`
  margin-top: 0;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  background-color: #ff00ff80;
`;

const TitleText = styled(CenteredAppText)`
  font-size: 20px;
`;

const SubTitleText = styled(CenteredAppText)`
  font-size: 18px;
`;

const SideContainer = styled.View`
  width: 25%;
`;

const CenterContainer = styled.View`
  width: 50%;
  flex-direction: column;
`;

const TopBar = (props) => {
    const {title, subTitle, Icon, SubMenu} = props;
    return <TopBarContainer>
        <SideContainer>{Icon}</SideContainer>
        <CenterContainer>
            <TitleText>{title}</TitleText>
            <SubTitleText>{subTitle}</SubTitleText>
        </CenterContainer>
        <SideContainer>{SubMenu}</SideContainer>
    </TopBarContainer>;
};

TopBar.propTypes = {
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired,
    Icon: PropTypes.node.isRequired,
    SubMenu: PropTypes.node.isRequired,
};

export default TopBar;
