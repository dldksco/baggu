import React from 'react';
import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
import Carousel from './Carousel';
import Chip from 'components/common/Chip';
import ItemModal from './ItemModal';
import ItemBottomBar from './ItemBottomBar';
import Carousel2 from './Carousel2';
import Carousel3 from './Carousel3';
const Container = styled.div`
  ${tw`w-full`}
`;
const ListWrapper = styled.div`
  ${tw`border-t-2 overflow-scroll overflow-x-hidden`}
  ${css`
    height: calc(100vh - 158px);
  `}
`;
const Wrapper = tw.div`flex p-2 border-b justify-between`;

const Info = styled.div`
  ${tw`relative flex items-start mr-[4px] overflow-hidden box-content whitespace-nowrap text-ellipsis w-full`}

  & {
    section {
      ${tw`flex-col`}
    }
  }
`;

const Title = tw.p`text-main-bold text-xl `;
const Message = tw.span`text-sub`;
const Product = styled.div`
  ${tw`w-80 h-80 rounded bg-cover bg-center`}
  ${props =>
    css`
      background-image: url(${props.img});
    `}
`;

function Item() {
  const userIdx = Number(localStorage.getItem('userIdx'));
  const [title, setTitle] = useState('');
  const [isSameUser, setIsSameUser] = useState(false);
  const [isAlreadyOffer, setIsAlreadyOffer] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [selected, setSelected] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState();
  const [apiState, setApiState] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [checkShow, setCheckShow] = useState(false);
  const [numOfferUser, setNumOfferUser] = useState();
  const [toggle, setToggle] = useState(false);
  const { id } = useParams();
  const [item, setItem] = useState([]);
  const [user, setUser] = useState([]);
  const [tradeDetailIdx, setTradeDetailIdx] = useState();
  const [matchData, setMatchData] = useState([]);
  // const { year, month, day, hour, minute } = FormatDate(item.createdAt);
  // const date = GetRelativeTime(year, month, day);
  const navigate = useNavigate();
  const CategoryTypes = [
    '???????????????',
    '????????????',
    '??????/????????????',
    '??????/??????',
    '????????????',
    '????????????',
    '????????????/??????',
    '??????/??????',
    '?????????/??????',
    '??????/??????/??????',
    '??????',
    '????????????',
    '??????????????????',
    '??????',
  ];
  // useEffect(() => {
  //   console.log(selected);
  // }, [selected]);
  useEffect(() => {
    const get_item = async id => {
      try {
        const { data } = await authInstance.get(requests.ITEM(id));
        console.log(data);
        return setItem(data);
      } catch (error) {
        console.log(error);
      }
    };
    get_item(id);
  }, [id]);
  const choose_request = async tradeDetailIdx => {
    try {
      const { data } = await authInstance.get(
        requests.CHOOSE_REQUEST(tradeDetailIdx)
      );
      console.log(data);
      console.log(tradeDetailIdx);
      return setMatchData(data);
    } catch (error) {
      console.log(error);
    }
  };
  const { data, isLoading } = useQuery(
    ['getUser', { userIdx: item.userIdx }],
    async () => await get_user(item.userIdx),
    {
      onSuccess: data => {
        // console.log(isSameUser);
        console.log(data);
        setUser(data);
        if (userIdx === item.userIdx) {
          setIsSameUser(true);
        }
        if (item.requestUserList.length > 10) {
          setIsFull(true);
        }
        const requestUsersList = item.requestUserList;
        const requestUsersIdx = [];
        requestUsersList.forEach(requestUser =>
          requestUsersIdx.push(requestUser.userIdx)
        );
        if (requestUsersIdx.includes(userIdx)) {
          setIsAlreadyOffer(true);
        }
      },
    }
  );
  const btnClickHandler = () => {
    if (isSameUser) {
      setCheckShow(!checkShow);
      if (apiState === '?????? ??????') {
        choose_request(tradeDetailIdx);
      }
    } else if (!isSameUser) {
      if (apiState === '???????????? ??????') {
        console.log(apiState);
        setIsAlreadyOffer(false);
      } else if (apiState === '????????????') {
        navigate(`/makeRequest/${id}`);
        setIsAlreadyOffer(true);
      }
    }
    setToggle(!toggle);
  };
  const deleteHandler = async () => {
    try {
      const { data } = await authInstance.delete(requests.ITEM(id));
      navigate('/');
      return;
    } catch (error) {
      console.log(error);
    }
  };

  const editHandler = () => {
    navigate(`/item/${id}/edit`);
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {showModal ? (
            <ItemModal
              onRemove={deleteHandler}
              onCancel={() => setShowModal(false)}
              onEdit={editHandler}
            />
          ) : (
            ''
          )}
          <TopBar2 />
          {/* <TopBar2
        title={`${userIdx === item.userIdx ? '????????? ?????? ??????' : ''}`}
      /> */}
          <ListWrapper>
            <Container>
              <UserInfo user={user} />

              <Carousel3
                id="carousel3"
                imgUrls={[
                  ...item.itemImgUrls,
                  ...item.itemImgUrls,
                  ...item.itemImgUrls,
                  ...item.itemImgUrls,
                ]}
              />

              {/* <Chip tradeState={item.tradeState} /> */}

              <Wrapper>
                <Info>
                  <section>
                    <Title>{item.title}</Title>
                    <Message>
                      {CategoryTypes[item.category]} | {item.dong} |
                      {GetRelativeTime(FormatDate(item.createdAt))}
                    </Message>
                  </section>
                  <img
                    className={`${isSameUser ? '' : 'hidden'}`}
                    onClick={() => setShowModal(true)}
                    src={option_button}
                    alt="profile_edit"
                  />
                </Info>
              </Wrapper>
              <Wrapper id="content">
                <p>{item.content}</p>
              </Wrapper>
              <BagguOfferList
                requestUserList={item.requestUserList}
                numOfferUser={numOfferUser}
                setNumOfferUser={setNumOfferUser}
                selected={selected}
                checkShow={checkShow}
                setSelected={setSelected}
                selectedIdx={selectedIdx}
                setSelectedIdx={setSelectedIdx}
                setTradeDetailIdx={setTradeDetailIdx}
              />
              <div className="p-2 flex w-full justify-center hover:bg-primary-hover border-b gap-2 relative">
                <Product img={item.itemImgUrls} />
                {/* <Carousel images={item.itemImgUrls} /> */}
                <Chip tradeState={item.tradeState} />
                {/* {item.itemImgUrls && <Carousel images={item.itemImgUrls} />} */}
              </div>
            </Container>
          </ListWrapper>
          <ItemBottomBar
            tradeState={item.tradeState}
            isSameUser={isSameUser}
            selected={selected}
            isAlreadyOffer={isAlreadyOffer}
            isFull={isFull}
            btnClickHandler={btnClickHandler}
            itemIdx={id}
            checkShow={checkShow}
            apiState={apiState}
            setApiState={setApiState}
            title={title}
            setTitle={setTitle}
            toggle={toggle}
            setToggle={setToggle}
            // ?????? ????????? ????????? ??????????????? ?????? ???????????? ??????????????? ????????????
            // ???????????? ???????????? ?????? ?????? ??????
            // ?????? ?????? ?????? ?????? ????????? ???????????? ????????????, selectedIdx??? null??? ???????????? ?????????
            // ???????????? ???????????? ??????????????? ???????????? ?????? ,
            // ???????????? ???????????? ???????????? ?????????, ?????? ??????????????? ????????? ?????? ?????? ????????????, ????????????????????? ???????????? isFull????????? ????????????
            //???????????? ???????????? ???????????? ????????? ?????? ????????? ????????? ???????????? ????????????, ???????????? ???????????? ??????
            // ???????????? ??????: ???????????? (?????????, ????????????)
          />
        </div>
      )}
    </div>
  );
}

export default Item;
