import styled from '@emotion/styled';
import { HiVideoCamera as FillCameraIcon } from 'react-icons/hi';
import { FaMicrophone as FillMicrophoneIcon } from 'react-icons/fa';
import { ImPhoneHangUp as PhoneIcon } from 'react-icons/im';

const Root = styled.div`
  width: 100%;
  height: 64px;
  background: #252525;
`;

const Divider = styled.div`
  height: 30px;
  width: 1px;
  background: #666666;
  margin-right: 10px;
`;

const ActionsWrapper = styled.div`
  float: right;
  height: 100%;
  display: flex;
  align-items: center;
`;

const IconButton = styled.div`
  width: 60px;
  height: 64px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledCameraIcon = styled(FillCameraIcon)`
  width: 25px;
  height: 25px;
`;

const StyledMicrophoneIcon = styled(FillMicrophoneIcon)`
  width: 20px;
  height: 20px;
  margin-top: 3px;
  margin-bottom: 3px;
`;

const IconLabel = styled.div`
  font-size: 11px;
`;

const LeaveButton = styled.div`
  width: 128px;
  height: 34px;
  margin-left: 100px;
  margin-right: 10px;
  border-radius: 3px;
  background: #c4314b;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;

  > svg {
    margin: 0 5px 0 0;
  }

  > span {
    margin: 0 5px;
  }
`;

const TopBar = () => (
  <>
    <Root>
      <ActionsWrapper>
        <Divider />
        <IconButton>
          <StyledCameraIcon />
          <IconLabel>Kamera</IconLabel>
        </IconButton>
        <IconButton>
          <StyledMicrophoneIcon />
          <IconLabel>Mikrofon</IconLabel>
        </IconButton>
        <LeaveButton>
          <PhoneIcon />
          <span>Opuść</span>
        </LeaveButton>
      </ActionsWrapper>
    </Root>
  </>
);

export default TopBar;
