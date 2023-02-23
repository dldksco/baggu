// 각 key는 API 명세에 'config.js상 이름'으로 명시함
// 각 key의 상단의 주석으로 API 명세 상 API 제목 명시함
const requests = {
  // baggu 공식
  base_url: 'https://baggu.shop/api',

  // 알림 서버 URL
  notify_base_url: 'https://baggu.shop/notifyapi',

  // 채팅 서버 URL
  chat_base_url: 'https://baggu.shop/chatapi',

  // 소정님 IP
  // base_url: 'http://49.167.206.142:9999',

  // 안채님 IP
  // base_url: 'http://70.12.247.174:9999',

  // 개발 테스트용 토큰 발급
  TEST_TOKEN: '/baggu/auth/token/dev',

  // 카카오로 시작하기 (GET)
  CHECK_IS_SIGNED(code, state) {
    return `/baggu/auth/login/kakao?code=${code}&state=${state}`;
  },

  // 유저 회원가입 (POST)
  SIGNUP: `/baggu/user`,

  // 유저 로그아웃 (POST)
  LOGOUT: `/baggu/user/logout`,

  // 유저 정보 가져오기 (GET)
  GET_USER(userIdx) {
    return `/baggu/user/${userIdx}`;
  },

  // 동네의 최근 등록된 물품 목록 (GET)
  GET_MAIN_ITEM(dong, page) {
    return `/baggu/item?dong=${dong}&page=${page}`;
  },

  // 최근 성사된 바꾸 목록 (GET)
  GET_MAIN_TRADE(page) {
    return `/baggu/tradeFin?page=${page}`;
  },

  //피드 좋아요 (POST), 피드 좋아요 취소 (DELETE)
  FEED_LIKE(tradeFinIdx) {
    return `/baggu/tradeFin/${tradeFinIdx}/like`;
  },

  // 유저의 모든 아이템 (GET)
  GET_USER_ITEM(userIdx) {
    return `/baggu/item?userIdx=${userIdx}`;
  },

  // 유저가 보낸 바꾸신청 (GET)
  GET_MY_REQUEST(userIdx) {
    return `/baggu/tradeRequest?userIdx=${userIdx}`;
  },

  // 바꾸신청 취소 (DELETE)
  DELETE_MY_REQUEST(tradeRequestIdx) {
    return `/baggu/tradeRequest/${tradeRequestIdx}`;
  },

  // 바꾸신청 승낙 (GET)
  CHOOSE_REQUEST(tradeDetailIdx) {
    return `/baggu/tradeDetail/${tradeDetailIdx}`;
  },

  // 특정 바꾸신청 하나 삭제 (DELETE)
  DELETE_REQUEST(tradeDetailIdx) {
    return `/baggu/tradeDetail/{tradeDetailIdx}`;
  },

  // 유저의 바꾸 내역 (GET)
  GET_USER_TRADE(userIdx) {
    return `/baggu/tradeFin?userIdx=${userIdx}`;
  },

  // 유저 동네 설정 (PUT)
  PUT_USER_TOWN(userIdx) {
    return `/baggu/user/${userIdx}/location`;
  },

  // 게시글 작성 (POST)
  POST_ITEM: `/baggu/item/`,

  // 게시글 상세 (GET)
  // 게시글 수정 (PUT)
  // 게시글 삭제 (DELETE)
  ITEM(itemIdx) {
    return `/baggu/item/${itemIdx}`;
  },

  // 유저 상세 중 등록 아이템 (GET)
  GET_USER_DETAIL(userIdx) {
    return `/baggu/user/${userIdx}/item`;
  },

  // 유저 프로필 수정 (PUT)
  PUT_USER_DETAIL(userIdx) {
    return `/baggu/user/${userIdx}/detail`;
  },

  // 바꾸 신청 삭제 (DELETE)
  DELETE_REQUEST(tradeRequestIdx) {
    return `/baggu/tradeRequest/${tradeRequestIdx}`;
  },

  // 유저 상세 중 거래후기 (GET)
  GET_REVIEWS(userIdx) {
    return `/baggu/user/${userIdx}/review`;
  },

  // 교환신청 (POST)
  POST_REQUEST(itemIdx) {
    return `/baggu/item/${itemIdx}`;
  },

  // 검색어 기반 아이템 리스트 (GET)
  GET_SEARCH_RESULT: '/baggu/item/keyword',

  // 거래 완료 후 유저에 대한 후기 작성 (POST)
  POST_USER_REVIEW: `/baggu/tradeFin/reviewTag`,

  // 거래 완료 후 거래에 대한 후기 작성 (POST)
  POST_TRADE_REVIEW: `/baggu/tradeFin/reviewText`,

  // 최근 알림 (알림 서버와 연결)
  GET_NOTIFY(userIdx) {
    return `/baggu/notify/${userIdx}`;
  },

  // 교환 신청시 알림 서버에 post
  // 알림 읽음 처리시 put, data는 notifyIdx
  POST_NOTIFY: '/baggu/notify',

  // 유저의 채팅방 목록 SSE(초기연결)
  GET_CHATROOMS: userIdx => {
    return `/baggu/${userIdx}/chatRoomList `;
  },

  // 유저의 채팅방 목록
  PUT_CHATROOMS: userIdx => {
    return `/baggu/${userIdx}/chatRoomList `;
  },

  // 유저의 채팅방 변경사항 SSE
  GET_CHATROOMS_UPDATE: userIdx => {
    return `/baggu/${userIdx}/chatRoom`;
  },

  // 새로운 채팅방 메세지 수신시
  // 변경사항이 발생한 채팅방 정보에 대한 GET 요청
  GET_UPDATED_CHATROOM: roomId => {
    return `/baggu/chatRoomUpdate/${roomId}`;
  },

  // 채팅방 상세 정보 GET
  GET_MESSAGES: roomId => {
    return `/baggu/chatRoom/${roomId}`;
  },

  // 채팅방 focusState 변경
  POST_CHATROOM_FOCUS: `/baggu/focusState`,

  // 채팅 보내기 POST
  POST_MESSAGE: `/baggu/chat`,

  // 거래상태 변경 POST
  POST_TRADE_STATUS: `/baggu/tradeFin`,
};

export default requests;
