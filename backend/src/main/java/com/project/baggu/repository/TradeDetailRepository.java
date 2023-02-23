package com.project.baggu.repository;

import com.project.baggu.domain.TradeDetail;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
public interface TradeDetailRepository extends JpaRepository<TradeDetail, Long> {
  @Modifying
  @Query("update TradeDetail t set t.isValid = false where t.tradeRequest.tradeRequestIdx = :tradeRequestIdx")
  void deleteTradeDetail(@Param("tradeRequestIdx") Long tradeRequestIdx);

  @Modifying
  @Query("update TradeDetail t set t.tradeState = 1 where t.tradeDetailIdx = :tradeDetailIdx")
  void updateTypeOne(@Param("tradeDetailIdx") Long tradeDetailIdx);

  @Query("select t from TradeDetail t where t.tradeRequest.tradeRequestIdx = :tradeRequestIdx")
  List<TradeDetail> findByTradeRequestIdx(@Param("tradeRequestIdx") Long tradeRequestIdx);

  @Query("select t from TradeDetail t where t.tradeRequest.tradeRequestIdx = :tradeRequestIdx and t.tradeState=1")
  Optional<TradeDetail> findFinItemByTradeRequestIdx(@Param("tradeRequestIdx") Long tradeRequestIdx);

  @Query("select t from TradeDetail t where t.requestItemIdx = :requestItemIdx and t.tradeState=1")
  Optional<TradeDetail> findFinItemByRequestItemIdx(@Param("requestItemIdx") Long requestItemIdx);

}
