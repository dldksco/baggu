import React from 'react';
import BagguList from 'components/common/BagguList';
import BagguListItem from 'components/common/BagguListItem';
import { useEffect, useState } from 'react';
import axios from 'axios';
import TopBar2 from 'components/common/TopBar2';
import { authInstance } from 'api/axios';
import requests from 'api/config';
import tw, { styled, css } from 'twin.macro';
const ListWrapper = styled.div`
  ${tw`border-t-4 overflow-scroll`}
  ${css`
    height: calc(100vh - 60px);
  `}
`;
function Baggu() {
  const userIdx = Number(localStorage.getItem('userIdx'));
  const [baggus, setBaggus] = useState([]);
  useEffect(() => {
    const get_user_trade = async userIdx => {
      try {
        const { data } = await authInstance.get(
          requests.GET_USER_TRADE(userIdx)
        );

        console.log('바꾸', data);
        setBaggus(data.items);
        return;
      } catch (error) {
        console.log(error);
      }
    };

    get_user_trade(userIdx);
  }, []);
  return (
    <div>
      <TopBar2 title="바꾸내역" />
      <ListWrapper>
        {baggus
          ? baggus.map(baggu => (
              <div key={baggu.tradeFinIdx}>
                <BagguListItem baggu={baggu} />
              </div>
            ))
          : ''}
      </ListWrapper>

      {/* <BagguList baggus={baggus} /> */}
    </div>
  );
}

export default Baggu;
