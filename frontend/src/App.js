import { useState, useEffect } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
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
import Favorite from 'pages/MyProfile/Favorite';
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

// Store
import { signUpStore, userStore } from 'store/store';
import { notificationStore } from 'store/notication';

// API
import requests from 'api/config';

// react-query
import { QueryClient, QueryClientProvider } from 'react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// styled component
import tw, { styled, css } from 'twin.macro';

const queryClient = new QueryClient();

const Wrapper = styled.div`
  ${tw`w-full`}
  ${css`
    height: calc(100% - 60px - 98px);
  `}
`;

// Main Component
function App() {
  const { saveToken, saveUserIdx, saveDong } = userStore(state => state);
  const userIdx = window.localStorage.getItem('userIdx');
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  // 알림서버와의 구독 상태
  const [listeningToNotify, setListeningToNotify] = useState(false);
  // 알림 리스트 전역 저장소
  const { unread, saveNotify, addNotify, countUnread } = notificationStore(
    state => state
  );
  let notifyEvent = undefined;

  useEffect(() => {
    // 로그인을 했고, 알림서버를 구독하고 있지 않은 상태라면 연결
    if (isLoggedIn && !listeningToNotify) {
      notifyEvent = new EventSource(
        `${requests.notify_base_url + requests.GET_NOTIFY(userIdx)}`
      );

      // 최초 연결
      notifyEvent.onopen = event => {
        // console.log('open : notify connection', event);
      };

      // 새로운 알림 도착
      notifyEvent.onmessage = event => {
        const parsedData = JSON.parse(event.data);
        // console.log('new received data', event);
        // console.log('new received notify', parsedData);
        addNotify(parsedData);
      };

      // 에러 발생
      notifyEvent.onerror = event => {
        // console.log('closed : notify connection');
        notifyEvent.close();
      };

      setListeningToNotify(true);
    }

    return () => {
      notifyEvent.close();
      // console.log('useEffect ended & notify closed');
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <BrowserRouter className="App">
        <TopBar1 />
        <Routes>
          <Route path="/example" element={<Example />} />
          <Route path="/start" element={<Start />}>
            <Route path="" element={<StartLogin />} />
            <Route path="nickname" element={<StartNickname />} />
            <Route path="town" element={<StartTown />} />
            <Route path="category" element={<StartCategory />} />
            <Route path="ready" element={<StartReady />} />
            <Route path="introduce" element={<StartIntroduce />} />
          </Route>
          <Route path="/kakaoLogin" element={<KakaoLogin />} />
          <Route path="/" element={<Home />} />
          <Route path="/userReview" element={<UserReview />} />
          <Route path="/bagguReview" element={<BagguReview />} />
          <Route path="/item/:id" element={<Item />} />
          <Route path="/item/create" element={<ItemCreate />} />
          <Route path="/mybaggu" element={<MyBaggu />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:id" element={<ChatDetail />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/myprofile/edit" element={<MyProfileEdit />} />
          <Route path="/myprofile/:id/baggu" element={<Baggu />} />
          <Route path="/myprofile/:id/myreview" element={<Myreview />} />
          <Route path="/myprofile/:id/favorite" element={<Favorite />} />
          <Route path="/myprofile/:id/town" element={<ProfileTown />} />
          <Route path="/user/:id" element={<UserDetail />} />
          {/* 바꾸신청 */}
          <Route path="/makeRequest/:itemIdx" element={<MakeRequest />} />
          <Route
            path="/makeRequest/message/:itemIdx"
            element={<MakeRequestMessage />}
          />
          {/* 알림 */}
          <Route path="/notification" element={<Notification />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
