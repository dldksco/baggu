package com.project.baggu.service;

import com.project.baggu.domain.Item;
import com.project.baggu.domain.TradeDetail;
import com.project.baggu.domain.TradeRequest;
import com.project.baggu.dto.ItemListDto;
import com.project.baggu.dto.TradeDeleteDto;
import com.project.baggu.dto.TradeRequestDto;
import com.project.baggu.exception.BaseException;
import com.project.baggu.exception.BaseResponseStatus;
import com.project.baggu.repository.ItemRepository;
import com.project.baggu.repository.TradeDetailRepository;
import com.project.baggu.repository.TradeRequestRepository;
import com.project.baggu.repository.UserRepository;
import java.util.ArrayList;
import java.util.List;

import io.jsonwebtoken.lang.Assert;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TradeRequestService {

  private final ItemRepository itemRepository;
  private final TradeRequestRepository tradeRequestRepository;
  private final TradeDetailRepository tradeDetailRepository;
  private final UserRepository userRepository;

  @Transactional
  public void tradeDelete(Long tradeRequestIdx) {
    try{
      tradeDetailRepository.deleteTradeDetail(tradeRequestIdx);
      tradeRequestRepository.deleteTradeRequest(tradeRequestIdx);
    } catch (Exception e){
      throw new BaseException(BaseResponseStatus.DATABASE_DELETE_ERROR);
    }
  }

  public List<ItemListDto> requestItemList(Long userIdx) {
    try{

    List <TradeRequest> list = tradeRequestRepository.findItemByUserIdx(userIdx);
    List<ItemListDto> userItemDtoList = new ArrayList<>();

    for(TradeRequest t : list){
      ItemListDto userItemDto = new ItemListDto();
      Item i = t.getReceiveItemIdx();
      userItemDto.setTitle(i.getTitle());
      userItemDto.setDong(i.getDong());
      userItemDto.setCreatedAt(i.getCreatedAt());
      userItemDto.setState(i.getState());
      userItemDto.setValid(i.isValid());
      userItemDto.setTradeRequestIdx(t.getTradeRequestIdx());
      userItemDto.setItemImgUrl(t.getReceiveItemIdx().getFirstImg());
      userItemDto.setItemIdx(i.getItemIdx());
      userItemDtoList.add(userItemDto);
    }
    return userItemDtoList;

    } catch (Exception e){
      throw new BaseException(BaseResponseStatus.DATABASE_GET_ERROR);
    }
  }



}
