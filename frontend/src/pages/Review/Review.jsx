import FormSubmitBtn from 'components/common/FormSubmitBtn';
import TopBar2 from 'components/common/TopBar2';
import React from 'react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import tw, { styled, css } from 'twin.macro';

const Wrapper = tw.div`w-full h-full`;
const Container = styled.div`
  ${tw`p-3`}
  & {
    p {
      ${tw`mb-3`}
    }
  }
`;
const ReviewContent = styled.div``;

const ReviewBtn = styled.div`
  ${tw`h-4 py-1 px-[12px] w-fit rounded-full flex justify-center items-center mb-1 text-main`}
  ${props =>
    props.isClicked
      ? tw`bg-secondary text-white`
      : tw`bg-white text-secondary border-1 border-secondary`}
`;
function Review() {
  const [clickedReviews, setClickedReviews] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
  });
  const userReviews = [
    '시간 약속을 잘 지켜요.',
    '친절하고 매너가 좋아요.',
    '답장이 빨라요.',
    '상품설명과 상품상태가 같아요.',
  ];

  const you = '유저1';

  // 유저 후기 post 요청 보내기
  const submitHandler = () => {};
  return (
    <Wrapper>
      <TopBar2 title="유저 후기 남기기" useCheckBtn={false} />
      <Container>
        <p>
          <span>{you}</span>님에 대한 후기를 남겨주세요.
        </p>
        <div>
          {userReviews.map((review, idx) => (
            <ReviewBtn
              isClicked={clickedReviews[idx]}
              key={idx}
              onClick={e => {
                setClickedReviews(prev => {
                  return { ...prev, [idx]: !prev[idx] };
                });
              }}
            >
              <span>{review}</span>
            </ReviewBtn>
          ))}
        </div>
      </Container>
      <FormSubmitBtn
        disabled={
          Object.values(clickedReviews).filter(x => x === true).length
            ? false
            : true
        }
        onClick={submitHandler}
        title="선택 완료"
      />
    </Wrapper>
  );
}

export default Review;
