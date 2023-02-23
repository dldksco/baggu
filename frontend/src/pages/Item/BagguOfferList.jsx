import React from 'react';
import { useState } from 'react';
import BagguOfferListItem from './BagguOfferListItem';
function BagguOfferList({
  requestUserList,
  numOfferUser,
  selected,
  checkShow,
  setSelected,
  selectedIdx,
  setSelectedIdx,
  setTradeDetailIdx,
}) {
  // setNumOfferUser(requestUserList.length);
  // const [selected, setSelected] = useState(false);
  // const [selectedIdx, setSelectedIdx] = useState();
  return (
    <div>
      <div>
        <span>바꾸신청한 사람들</span>
        <span>{numOfferUser} / 10</span>
      </div>
      {requestUserList.map(requestUser => (
        <div key={requestUser.userIdx}>
          <BagguOfferListItem
            requestUser={requestUser}
            selected={selected}
            setSelected={setSelected}
            selectedIdx={selectedIdx}
            setSelectedIdx={setSelectedIdx}
            checkShow={checkShow}
            setTradeDetailIdx={setTradeDetailIdx}
          />
        </div>
      ))}
    </div>
  );
}

export default BagguOfferList;
