import React from 'react';
import { useState, useEffect } from 'react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar2 from '../../components/common/TopBar2';
import FormSubmitBtn from 'components/common/FormSubmitBtn';
import { authInstance } from 'api/axios';
import requests from 'api/config';
import ImageAddButton from 'pages/Item/ImageAddButton';

// twin.macro
import tw, { styled, css } from 'twin.macro';

// Styled Component
const Avatar = styled.div`
  ${tw`bg-primary rounded-full w-10 h-10 bg-cover bg-center mr-2 relative`}
  ${props => css`
    background-image: url(${props.img});
  `}
`;
const PreviewImg = styled.img`
  ${tw`rounded-lg w-[5rem] h-[5rem] box-border cursor-pointer`}
  ${props => (props.isFirstImg ? tw`border-2 border-primary` : tw``)}
`;
const InputContainer = styled.div`
  ${tw`flex-col pt-2 pb-2 px-4`}

  & {
    input {
      ${tw`w-full rounded-lg mb-1 p-1 box-border h-6 text-main`}
      ${props =>
        props.isValid
          ? tw`focus:outline focus:outline-primary`
          : tw`focus:outline focus:outline-negative`}
    }
    p {
      ${tw`text-negative text-tiny`}
    }
  }
`;

const ProfileImgContainer = styled.div`
  ${tw`flex justify-center items-center p-5`}
`;

const ImgWrapper = styled.div`
  ${tw`relative`}
`;

const ImgAddBtn = styled.div`
  ${tw`w-3 h-3 absolute right-2 bottom-0 fill-secondary drop-shadow-lg cursor-pointer`}
`;

// Main Component
function MyProfileEdit() {
  const userIdx = Number(localStorage.getItem('userIdx'));
  const [nickname, setNickname] = useState('');
  const [nicknameMessage, setNicknameMessage] = useState('');
  const [isNicknameTouched, setIsNicknameTouched] = useState(false);
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [introduction, setIntroduction] = useState('');
  const [introductionMessage, setIntroductionMessage] = useState('');
  const [isIntroductionTouched, setIsIntroductionTouched] = useState(false);
  const [isIntroductionValid, setIsIntroductionValid] = useState(false);
  const [userImage, setUserImage] = useState();
  const [newImage, setNewImage] = useState();

  const navigate = useNavigate();
  const onChangeNicknameInput = useCallback(e => {
    // setIsTouched(true);
    setNickname(e.target.value);
    setIsNicknameTouched(true);

    if (e.target.value.trim() === '') {
      setIsNicknameValid(false);
      setNicknameMessage('닉네임을 입력해주세요.');
      return;
    } else if (
      e.target.value.trim().length < 2 ||
      e.target.value.trim().length > 10
    ) {
      setIsNicknameValid(false);
      setNicknameMessage('2글자 이상 10글자 미만으로 입력해주세요.');
      return;
    } else {
      setNicknameMessage('');
      setIsNicknameValid(true);
    }
  }, []);
  const onChangeIntroductionInput = useCallback(e => {
    setIntroduction(e.target.value);
    setIsIntroductionTouched(true);

    if (e.target.value.trim().length > 20) {
      setIsIntroductionValid(false);
      setIntroductionMessage('20글자 미만으로 입력해주세요.');
      return;
    } else {
      setIntroductionMessage('');
      setIsIntroductionValid(true);
    }
  }, []);
  const handleClickAddImage = () => {
    document.getElementById('imageInput').click();
  };
  // const handleUserImage = event => {
  //   const image = event.target.files;
  //   formData.append('profileImg', image);
  //   setUserImage(formData.file);
  //   console.log(formData);
  // };
  useEffect(() => {
    console.log(newImage);
  }, [newImage]);
  const handleUserImage = event => {
    const file = event.target.files[0];

    // const reader = new FileReader();

    // reader.onload = event => {
    //   setUserImage(event.target.result);
    //   console.log(event.target.result);
    // };

    // reader.readAsDataURL(file);
    // // console.log(event.target.files[0]);
    setNewImage(file);
  };
  const submitHandler = () => {
    if (isValidName && isValidIntroduction) {
      const formData = new FormData();
      formData.append('nickname', nickname);
      // console.log(nickname);
      formData.append('info', introduction);
      // console.log(introduction);
      if (newImage === 0) {
        formData.append('profileImg', userImage);
      } else {
        formData.append('profileImg', newImage);
      }
      // console.log(userImage);

      const put_user_detail = async () => {
        try {
          const response = await authInstance.put(
            requests.PUT_USER_DETAIL(userIdx),
            formData,
            {
              headers: {
                Authorization: localStorage.getItem('token'),
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          // console.log(response);
          return response;
        } catch (error) {
          throw error;
        }
      };
      put_user_detail();

      navigate('/');
    }
  };

  const isValidName = isNicknameTouched && isNicknameValid;
  const isValidIntroduction = isIntroductionTouched && isIntroductionValid;
  useEffect(() => {
    const get_user = async () => {
      try {
        const { data } = await authInstance.get(requests.GET_USER(userIdx));

        // console.log(data);
        setNickname(data.nickname);
        setIntroduction(data.info);
        setUserImage(data.profileImgUrl);
        return data;
      } catch (error) {
        console.log(error);
      }
    };

    get_user();
  }, []);
  return (
    <div>
      <TopBar2 title="프로필수정" />
      <ProfileImgContainer>
        <ImgWrapper>
          {newImage ? (
            <Avatar img={URL.createObjectURL(newImage)} />
          ) : (
            <Avatar img={userImage} />
          )}
          <ImgAddBtn onClick={handleClickAddImage}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" />
            </svg>
          </ImgAddBtn>
          {/* <ImageAddButton clickFunction={handleClickAddImage} /> */}
        </ImgWrapper>
      </ProfileImgContainer>
      <input
        id="imageInput"
        type="file"
        accept="img/*"
        onChange={handleUserImage}
        className="display: hidden"
        multiple={false}
      />

      {/* 유저 프로필 이미지 컴포넌트 (클릭시 앨범에서 이미지 파일 선택받기) */}

      <form action="submit">
        <InputContainer disabled={isValidName ? false : true}>
          <label htmlFor="Username">닉네임</label>
          {/* placeholder에는 유저 본인 닉네임, 한줄소개를 기본으로 넣을지 아닐지 고민중 */}
          <input
            type="text"
            onChange={onChangeNicknameInput}
            placeholder={nickname}
            name="Username"
          />
          <p>{nicknameMessage}</p>
        </InputContainer>
        <InputContainer disabled={isValidIntroduction ? false : true}>
          <label htmlFor="UserIntroduction">한줄소개</label>
          <input
            type="text"
            onChange={onChangeIntroductionInput}
            name="UserIntroduction"
            placeholder={introduction}
          />
          <p>{introductionMessage}</p>
        </InputContainer>
      </form>
      <FormSubmitBtn onClick={submitHandler} title="입력완료" />
    </div>
  );
}

export default MyProfileEdit;
