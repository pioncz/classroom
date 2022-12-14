import styled from '@emotion/styled';
import { GrClose as CloseIcon } from 'react-icons/gr';
import {
  HiUserAdd as UserIcon,
  HiVideoCamera as FillCameraIcon,
} from 'react-icons/hi';
import { MdOutlineEdit as EditIcon } from 'react-icons/md';

const Root = styled.div`
  background: #1f1f1f;
`;

const MutedInfo = styled.div`
  display: flex;
  background: #d6d6d6;
  font-size: 12px;
  padding: 5px 15px;

  > span {
    flex: 1 0;
    color: #242424;
  }

  > span > span {
    margin-left: 5px;
    font-weight: 600;
    color: #4a4794;
  }

  svg {
    width: 18px;
    height: 18px;
    margin-right: -5px;
  }

  path {
    stroke: #989898;
  }
`;

const Header = styled.div`
  display: flex;
  padding: 20px 15px;
  color: #fff;
  font-weight: 600;
  border-bottom: 1px solid #000;
  font-size: 18px;

  span {
    flex: 1 1;
  }

  path {
    stroke: #989898;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
`;

const ListItem = styled.div`
  display: flex;
  padding: 5px 30px;
  color: #989898;
  margin: 10px 0;
`;

const ListIcon = styled.div`
  svg {
    width: 25px;
    height: 25px;
  }

  ${({ purple }) => (purple ? 'color: #7F85F5;' : '')}
`;

const ListText = styled.div`
  font-size: 14px;
  font-weight: 600;
  padding-left: 10px;
  padding-top: 2px;
`;

const ChatBar = ({ className }) => (
  <Root className={className}>
    <MutedInfo>
      <span>
        Ten czat jest wyciszony.
        <span>Ustawienia</span>
      </span>
      <CloseIcon />
    </MutedInfo>
    <Header>
      <span>Czat spotkania</span>
      <CloseIcon />
    </Header>
    <Body>
      <ListItem>
        <ListIcon>
          <UserIcon />
        </ListIcon>
        <ListText>
          Użytkownik Marianna Lisiecka-Syska dołączyła do konwersacji.
        </ListText>
      </ListItem>
      <ListItem>
        <ListIcon>
          <EditIcon />
        </ListIcon>
        <ListText>
          Użytkownik Marianna Lisiecka-Syska nadała nazwę Spotkanie z
          użytkownikiem Marianna Lisiecka-Syska
        </ListText>
      </ListItem>
      <ListItem>
        <ListIcon purple>
          <FillCameraIcon />
        </ListIcon>
        <ListText>Spotkanie rozpoczęło się</ListText>
      </ListItem>
    </Body>
  </Root>
);

export default ChatBar;
