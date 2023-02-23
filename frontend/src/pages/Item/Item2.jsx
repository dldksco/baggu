import React from 'react';
import { useQueries, useQuery } from 'react-query';
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { authInstance } from 'api/axios';
import requests from 'api/config';
import TopBar2 from 'components/common/TopBar2';
import UserInfo from 'components/common/UserInfo';
import BagguOfferList from './BagguOfferList';
import { get_user } from 'api/apis/user';
import tw, { styled, css } from 'twin.macro';
import FormatDate from 'hooks/FormatDate';
import GetRelativeTime from 'hooks/GetRelativeTime';
import option_button from 'assets/icons/option_button.svg';
import Chip from 'components/common/Chip';
import ItemModal from './ItemModal';
import ItemBottomBar from './ItemBottomBar';
import Carousel3 from './Carousel3';
import { get_item } from 'api/apis/item';
import UserInfo2 from 'components/common/UserInfo2';
import ItemDetailBottomBar from 'components/common/ItemDetailBottomBar';
import Modal from 'components/common/Modal';
import FormSubmitBtn from 'components/common/FormSubmitBtn';
import { delete_my_request } from 'api/apis/request';

// Styled component
const Container = styled.div`
  ${tw`w-full`}
`;
const ListWrapper = styled.div`
  ${tw`border-t-2 overflow-scroll overflow-x-hidden`}
  ${css`
    height: calc(100vh - 158px);
  `}
`;
const Wrapper = tw.div`flex p-2 border-b justify-between relative`;

const Info = styled.div`
  ${tw`relative flex items-start justify-between mr-[4px] overflow-hidden box-content whitespace-nowrap text-ellipsis w-full`}

  & {
    section {
      ${tw`flex-col`}
    }
  }
`;

const Title = tw.p`text-main-bold text-xl `;
const Message = tw.span`text-sub text-grey2`;
const Product = styled.div`
  ${tw`w-80 h-80 rounded bg-cover bg-center`}
  ${props =>
    css`
      background-image: url(${props.img});
    `}
`;
const BagguListWrapper = styled.div`
  ${tw`bg-primary p-2 rounded-xl m-2 mb-[114px] shadow-lg`}
`;
const BagguListHeading = styled.div`
  ${tw`flex m-1 gap-1 items-end`}
  & {
    h3 {
      ${tw`text-h3`}
    }
  }
  span {
    ${tw`text-grey3`}
  }
`;

const RequestItemsWrapper = styled.div`
  ${tw`flex p-2 gap-2`}
`;

const RequestItem = styled.div`
  ${tw`w-[100px] h-[100px] min-w-[100px] bg-cover bg-center rounded-lg border-1 border-primary-hover cursor-pointer`}
  ${props =>
    css`
      background-image: url(${props.img});
    `}
`;

const UserContainer = styled.div`
  ${tw`border-b border-primary-hover last:border-none`}
`;

const MoreMenu = styled.div`
  ${props => (props.show ? tw`` : tw`hidden`)}
`;

// Main Component
const Item2 = props => {
  // itemIdx
  const { id: itemIdx } = useParams();

  // 로그인한 사용자
  const me = Number(localStorage.getItem('userIdx'));

  // 1. 작성자
  const [writer, setWriter] = useState();
  // 2. 아이템 정보
  const [item, setItem] = useState();
  // 3. 신청자 리스트
  const [requestList, setRequestList] = useState([]);
  // 4. 버튼 비활성화 여부
  const [disabled, setDisabled] = useState(false);
  // 5. 신청자 목록
  const [requestUserIdxList, setRequestUserIdxList] = useState([]);
  // 6. 버튼 제목
  const [btnTitle, setBtnTitle] = useState();
  // 7. 모달 상태
  const [showModal, setShowModal] = useState(false);
  // 8. 선택된 아이템의 itemIdx
  const [selectedItemIdx, setSelectedItemIdx] = useState();
  // 9. 제출 버튼 상태
  const [showSubmitBtn, setShowSubmitBtn] = useState(false);
  // 10. 수정삭제 메뉴 상태
  const [showMore, setShowMore] = useState(false);
  // 11. 삭제 모달 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();

  // 아이템 가져온 후 작성자 가져오기
  useEffect(() => {
    get_item(itemIdx).then(data => {
      setItem(data);
      setRequestList(data.requestUserList);
      data.requestUserList.forEach(request =>
        setRequestUserIdxList(prev => [...prev, request.userIdx])
      );
      // 거래상태가 0이 아니면 언제나 비활성화
      if (data.tradeState !== 0) setDisabled(true);
    });
  }, [itemIdx]);

  // 버튼 제목 설정, 비활성화 여부 설정
  useEffect(() => {
    get_user(item?.userIdx).then(data => {
      setWriter(data);
      // const writerIdx = data.userIdx;
      // console.log('me :', me, 'writer :', data.userIdx);
      // let title = '';

      // // 거래상태가 0이 아니면 언제나 비활성화
      // if (item.tradeState !== 0) setDisabled(true);

      // // 내가 작성자일 때
      // if (me === writerIdx) {
      //   title = '선택하기';
      //   console.log('여기서 requestList가 없다고?', requestList);
      //   if (!requestList.length) setDisabled(true);
      // } else if (me !== writerIdx && !requestUserIdxList.includes(me)) {
      //   title = '바꾸신청';
      //   // 신청할 수 있는 자리가 없을 때
      //   if (requestList.length >= 10) setDisabled(true);
      // } else if (me !== writerIdx && requestUserIdxList.includes(me)) {
      //   title = '신청취소';
      // }
      // // console.log('btnTitle', title);
      // setBtnTitle(title);
    });
  }, [item]);

  useEffect(() => {
    let title = '';
    // const writerIdx = writer.userIdx;

    // // 거래상태가 0이 아니면 언제나 비활성화
    // if (item.tradeState !== 0) setDisabled(true);

    // 내가 작성자일 때
    if (me === writer?.userIdx) {
      title = '선택하기';
      console.log('여기서 requestList가 없다고?', requestList);
      if (!requestList.length) setDisabled(true);
    } else if (me !== writer?.userIdx && !requestUserIdxList.includes(me)) {
      title = '바꾸신청';
      // 신청할 수 있는 자리가 없을 때
      if (requestList.length >= 10) setDisabled(true);
    } else if (me !== writer?.userIdx && requestUserIdxList.includes(me)) {
      title = '신청취소';
    }
    // console.log('btnTitle', title);
    setBtnTitle(title);
  }, [writer]);

  const CategoryTypes = [
    '디지털기기',
    '생활가전',
    '가구/인테리어',
    '생활/주방',
    '여성의류',
    '여성잡화',
    '남성패션/잡화',
    '뷰티/미용',
    '스포츠/레저',
    '취미/게임/음반',
    '도서',
    '가공식품',
    '반려동물용품',
    '기타',
  ];

  // 버튼핸들러
  // 1. 바꾸신청 - 바꾸신청 페이지로 이동
  // 2. 바꾸신청 취소 - 모달 띄우기
  // 3. 선택하기 - 물건 선택 페이지로
  // 4. 거절하기 - 신청자 삭제 페이지로

  // 1. 바꾸신청 페이지로 이동
  const moveToMakeRequest = () => {
    navigate(`/makeRequest/${itemIdx}`);
  };

  // 2. 바꾸신청 취소 -> 새로고침
  const cancelRequest = () => {
    let tradeRequestIdx = '';
    requestList.forEach(request => {
      if (request.userIdx === me) {
        tradeRequestIdx = request.tradeRequestIdx;
      }
    });
    delete_my_request(tradeRequestIdx).then(() => navigate(`/item/${itemIdx}`));
    window.location.reload();
  };

  // 3. 선택하기
  const chooseRequest = () => {
    navigate(`/chooseRequest/${itemIdx}`);
  };

  // 4. 거절하기
  const rejectRequest = () => {
    navigate(`/deleteRequest/${itemIdx}`);
  };

  // 버튼 제목에 따른 핸들러 함수
  const ButtonHandlerTypes = {
    바꾸신청: moveToMakeRequest,
    신청취소: () => setShowModal(true),
    선택하기: chooseRequest,
    거절하기: rejectRequest,
  };

  // 수정페이지로 이동
  const moveToEdit = () => {
    navigate(`/item/${itemIdx}/edit`);
  };
  const deleteconfirmHandler = async () => {
    try {
      const { data } = await authInstance.delete(requests.ITEM(itemIdx));
      navigate('/');
      return;
    } catch (error) {
      console.log(error);
    }
  };
  const deleteHandler = async () => {
    setShowDeleteModal(true);
  };

  return (
    <div>
      {showDeleteModal ? (
        <Modal
          onConfirm={deleteconfirmHandler}
          onCancel={() => setShowModal(false)}
          title="게시글 삭제"
          content="정말 게시글을 삭제하시겠어요??"
          cancelText="아니요"
          confirmText="네"
        />
      ) : (
        ''
      )}

      {showModal ? (
        <Modal
          onConfirm={cancelRequest}
          onCancel={() => setShowModal(false)}
          title="바꾸신청 취소"
          content="정말 신청하신 내역을 취소하실건가요?"
          cancelText="아니요"
          confirmText="네"
        />
      ) : (
        ''
      )}
      <TopBar2 />
      {item && writer ? (
        <div className="relative">
          <UserInfo user={writer} />
          <Carousel3 imgUrls={item.itemImgUrls} />
          <Wrapper>
            <Info>
              <section>
                <Title>{item.title}</Title>
                <Message>
                  {CategoryTypes[item.category]} | {item.dong} |
                  <span> {GetRelativeTime(FormatDate(item.createdAt))}</span>
                </Message>
              </section>
              <img
                src={option_button}
                alt="profile_edit"
                className="cursor-pointer"
                onClick={() => setShowMore(prev => !prev)}
              />
            </Info>
            <MoreMenu
              show={showMore}
              className="absolute right-1 w-fit h-fit z-10 bg-white top-5 flex flex-col shadow-md rounded border-1"
            >
              <div
                className="p-1 px-2 cursor-pointer hover:bg-primary-hover hover:text-primary"
                onClick={moveToEdit}
              >
                <span>수정</span>
              </div>
              <div
                className="p-1 px-2 cursor-pointer hover:bg-primary-hover hover:text-primary"
                onClick={deleteHandler}
              >
                <span>삭제</span>
              </div>
            </MoreMenu>
          </Wrapper>
          <div id="content" className="p-3 pb-5">
            <p>{item.content}</p>
          </div>
          {requestList ? (
            <BagguListWrapper id="here">
              <BagguListHeading>
                <h3>신청자 목록</h3>
                <span>{requestList.length} / 10</span>
              </BagguListHeading>
              {requestList.map((request, index) => (
                <UserContainer key={index}>
                  <UserInfo2
                    addUserIdx={request.userIdx}
                    message={request.comment}
                  />
                  <RequestItemsWrapper>
                    {request.requestItemList.map(item => (
                      <RequestItem
                        key={item.requestItemIdx}
                        img={item.requestItemFirstImg}
                        onClick={() => navigate(`/item/${item.requestItemIdx}`)}
                      />
                    ))}
                  </RequestItemsWrapper>
                </UserContainer>
              ))}
            </BagguListWrapper>
          ) : (
            ''
          )}
          <ItemDetailBottomBar
            btnTitle={btnTitle}
            disabled={disabled}
            btnClickHandler={ButtonHandlerTypes[btnTitle]}
          />
        </div>
      ) : (
        ''
      )}
      {showSubmitBtn ? <FormSubmitBtn /> : ''}
    </div>
  );
};

export default Item2;
