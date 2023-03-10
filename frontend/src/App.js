import { useState, useEffect } from 'react';
import {
  Route,
  Routes,
  BrowserRouter,
  useNavigate,
  Navigate,
} from 'react-router-dom';
import Home from 'pages/Home/Home';
import Start from 'pages/Start/Start';
import StartLogin from 'pages/Start/StartLogin';
import StartNickname from 'pages/Start/StartNickname';
import StartTown from 'pages/Start/StartTown';
import Example from 'pages/Example/Example';
import TopBar1 from 'components/common/TopBar1';
import BottomNav from 'components/common/BottomNav';
import BottomBar from 'components/common/BottomBar';
import Item from 'pages/Item/Item';
import ItemCreate from 'pages/Item/ItemCreate';
import MyBaggu from 'pages/MyBaggu/MyBaggu';
import MyProfile from 'pages/MyProfile/MyProfile';
import StartCategory from 'pages/Start/StartCategory';
import StartReady from 'pages/Start/StartReady';
import StartIntroduce from 'pages/Start/StartIntroduce';
import MyProfileEdit from 'pages/MyProfile/MyProfileEdit';
import Baggu from 'pages/MyProfile/Baggu';
import Myreview from 'pages/MyProfile/Myreview';
import ProfileTown from 'pages/MyProfile/ProfileTown';
import Chat from 'pages/Chat/Chat';
import UserDetail from 'pages/User/UserDetail';
import ChatDetail from 'pages/Chat/ChatDetail';
import UserReview from 'pages/Review/UserReview';
import BagguReview from 'pages/Review/BagguReview';
import KakaoLogin from 'pages/Start/KakaoLogin';
import MakeRequest from 'pages/MakeRequest/MakeRequest';
import MakeRequestMessage from 'pages/MakeRequest/MakeRequestMessage';
import Notification from 'pages/Notification/Notification';
import Item2 from 'pages/Item/Item2';
import Search from 'pages/Search/Search';
import ItemEdit from 'pages/Item/ItemEdit';

// react-cookie
import { CookiesProvider } from 'react-cookie';

// Store
import { notificationStore } from 'store/notication';

// API
import requests from 'api/config';
import { get_chatrooms, get_updated_chatroom } from 'api/apis/chat';

// react-query
import { QueryClient, QueryClientProvider } from 'react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// styled component
import tw, { styled, css } from 'twin.macro';
import ChooseRequest from 'pages/ChooseRequest/ChooseRequest';
import DeleteRequest from 'pages/ChooseRequest/ChooseRequest';
import { chatStore } from 'store/chat';

const queryClient = new QueryClient();

// Main Component
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn')
  );
  const userIdx = window.localStorage.getItem('userIdx');
  // const isLoggedIn = localStorage.getItem('isLoggedIn');

  // ???????????? SSE ?????? ??????
  const [listeningToNotify, setListeningToNotify] = useState(false);
  // ?????? ????????? ?????? ?????????
  const { addNotify } = notificationStore(state => state);

  /// ?????????????????? SSE ?????? ??????
  const [isListeningToRoom, setIsListeningToRoom] = useState(false);
  // ????????? ???????????? SSE ?????? ??????
  const [isListeningToRoomUpdate, setIsListeningToRoomUpdate] = useState(false);
  // ?????????????????? ?????? ?????????
  const {
    chatRoomList,
    totalUnreadMsg,
    addChatRoom,
    clearChatRoom,
    updateChatRoom,
  } = chatStore(state => state);

  // ??????
  useEffect(() => {
    // ?????????????????? SSE
    let chatRoomEvent = undefined;

    // ?????????????????? SSE ??????
    if (isLoggedIn && !isListeningToRoom) {
      chatRoomEvent = new EventSource(
        `${requests.chat_base_url + requests.GET_CHATROOMS(userIdx)}`
      );

      // ?????? ??????
      chatRoomEvent.onopen = event => {
        console.log('open : chatroom', event);
      };

      // ???????????? ?????? ????????? ???????????? ??????
      chatRoomEvent.onmessage = event => {
        const parsedData = JSON.parse(event.data);
        console.log('new chatroom sse', parsedData);
        addChatRoom(parsedData);
      };

      chatRoomEvent.onerror = event => {
        console.log('error and closed');
        chatRoomEvent.close();
      };

      setIsListeningToRoom(true);
    }

    // clean up function!
    return;
  }, [isLoggedIn, isListeningToRoom]);

  // ????????? ???????????? SSE
  useEffect(() => {
    let chatRoomUpdateEvent = undefined;

    // ????????? ???????????? SSE ??????
    if (isLoggedIn && !isListeningToRoomUpdate) {
      chatRoomUpdateEvent = new EventSource(
        `${requests.chat_base_url + requests.GET_CHATROOMS_UPDATE(userIdx)}`
      );

      // ?????? ??????
      chatRoomUpdateEvent.onopen = event => {
        console.log('open : ????????? ????????????');
      };

      // ???????????? ??????
      chatRoomUpdateEvent.onmessage = async event => {
        // ??????????????? ????????? ???????????? roomId
        const roomId = JSON.parse(event.data).roomId;
        /*
        {
          "chatId":"63da0f656408703b4fae5d21",
          "msg":"???????",
          "receiverIdx":5,
          "senderIdx":6,
          "roomId":"63da08172a56c42cc9b85a61",
          "createdAt":"2023-02-01T16:06:13.261"
        }
         */
        // GET ???????????? ?????? ???????????? ?????? ????????? ????????? ????????????
        await get_updated_chatroom(roomId).then(data => {
          console.log('get updated chatroom :', data);
          updateChatRoom(roomId, data);
        });
      };

      chatRoomUpdateEvent.onerror = event => {
        console.log('closed : ????????? ????????????');
        chatRoomUpdateEvent.close();
      };

      setIsListeningToRoomUpdate(true);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    // ?????? SSE
    let notifyEvent = undefined;

    // 1. ?????? SSE ??????
    if (isLoggedIn !== null && !listeningToNotify) {
      notifyEvent = new EventSource(
        `${requests.notify_base_url + requests.GET_NOTIFY(userIdx)}`
      );

      // ?????? ?????? ??????
      notifyEvent.onopen = event => {
        console.log('open : notify', event);
      };

      // ????????? ?????? ??????
      notifyEvent.onmessage = event => {
        const parsedData = JSON.parse(event.data);
        // console.log('new received data', event);
        console.log('new received notify', parsedData);
        addNotify(parsedData);
      };

      // ?????? ??????
      notifyEvent.onerror = event => {
        console.log('closed : notify');
        notifyEvent.close();
      };

      setListeningToNotify(true);
      return;
      //  () => {
      //   notifyEvent.close();
      //   setListeningToNotify(false);
      //   // console.log('useEffect ended & notify closed');
      // };
    }

    return;
  }, [isLoggedIn]);

  // ?????? ???????????? KakaoLogin?????? ???????????? App.js??? ???????????? ???????????????.
  const handleLogin = isLoggedIn => {
    console.log('???????????? ????????? ????????? ????????????');
    setIsLoggedIn(isLoggedIn);
  };

  return (
    <CookiesProvider>
      <QueryClientProvider client={queryClient} contextSharing={true}>
        <BrowserRouter className="App">
          <div className="w-[300px]">
            <TopBar1 />
            <Routes>
              <Route
                path="/login"
                element={!isLoggedIn ? <Start /> : <Navigate to="/" replace />}
              >
                <Route path="" element={<StartLogin />} />
                <Route path="nickname" element={<StartNickname />} />
                <Route path="town" element={<StartTown />} />
                <Route
                  path="category"
                  element={<StartCategory onLogin={handleLogin} />}
                />
                <Route path="ready" element={<StartReady />} />
                <Route path="introduce" element={<StartIntroduce />} />
              </Route>
              <Route
                path="/kakaoLogin"
                element={<KakaoLogin onLogin={handleLogin} />}
              />
              <Route
                path="/"
                element={
                  isLoggedIn ? <Home /> : <Navigate to="/login" replace />
                }
              />
              {/* ?????? */}
              <Route
                path="/userReview"
                element={
                  isLoggedIn ? <UserReview /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/bagguReview"
                element={
                  isLoggedIn ? (
                    <BagguReview />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              {/* ????????? */}
              <Route
                path="/item/:id"
                element={
                  isLoggedIn ? <Item2 /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/item/:id/edit"
                element={
                  isLoggedIn ? <ItemEdit /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/item/create"
                element={
                  isLoggedIn ? <ItemCreate /> : <Navigate to="/login" replace />
                }
              />
              {/* ??? ???????????? */}
              <Route
                path="/mybaggu"
                element={
                  isLoggedIn ? <MyBaggu /> : <Navigate to="/login" replace />
                }
              />
              {/* ?????? */}
              <Route
                path="/chat"
                element={
                  isLoggedIn ? <Chat /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/chat/:roomId"
                element={
                  isLoggedIn ? <ChatDetail /> : <Navigate to="/login" replace />
                }
              />
              {/* ??? ????????? */}
              <Route
                path="/myprofile"
                element={
                  isLoggedIn ? (
                    <MyProfile onLogin={handleLogin} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/myprofile/edit"
                element={
                  isLoggedIn ? (
                    <MyProfileEdit />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/myprofile/:id/baggu"
                element={
                  isLoggedIn ? <Baggu /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/myprofile/:id/myreview"
                element={
                  isLoggedIn ? <Myreview /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/myprofile/:id/town"
                element={
                  isLoggedIn ? (
                    <ProfileTown />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/user/:id"
                element={
                  isLoggedIn ? <UserDetail /> : <Navigate to="/login" replace />
                }
              />
              {/* ???????????? */}
              <Route
                path="/makeRequest/:itemIdx"
                element={
                  isLoggedIn ? (
                    <MakeRequest />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/makeRequest/message/:itemIdx"
                element={
                  isLoggedIn ? (
                    <MakeRequestMessage />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              {/* ????????? ?????? ?????? ??? ?????? */}
              <Route
                path="/chooseRequest/:itemIdx"
                element={
                  isLoggedIn ? (
                    <ChooseRequest />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/deleteRequest/:itemIdx"
                element={
                  isLoggedIn ? (
                    <DeleteRequest />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              {/* ?????? */}
              <Route
                path="/notification"
                element={
                  isLoggedIn ? (
                    <Notification />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              {/* ?????? */}
              <Route
                path="/search"
                element={
                  isLoggedIn ? <Search /> : <Navigate to="/login" replace />
                }
              />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </CookiesProvider>
  );
}

export default App;
