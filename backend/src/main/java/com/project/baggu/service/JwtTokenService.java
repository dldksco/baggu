package com.project.baggu.service;

import com.project.baggu.exception.BaseResponseStatus;

import com.project.baggu.domain.RefreshToken;
import com.project.baggu.exception.BaseException;
import com.project.baggu.repository.RefreshTokenRepository;
import com.project.baggu.utils.JwtTokenUtils;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class JwtTokenService {

  private final RefreshTokenRepository refreshTokenRepository;

  /**
   * 액세스 토큰 갱신
   * userIdx를 통해 redis에서 refreshtoken 존재하는지 확인, Client가 발급한 refreshToken 유효성 검사
   * Redis에서 조회한 AccessProvideTime이 실제 accesstoken 유효기간 전이라면 refreshtoken 탈취로 판단해서 refreshtoken 삭제 및 재로그인요청
   * @param refreshToken
   * @return
   * @author So jung Kim
   * @author An Chae Lee(Modifier)
   */
  public String renewAccessToken(String refreshToken) {

    //refreshToken에서 userIdx, role 뽑아내기
    Long userIdx = Long.parseLong(JwtTokenUtils.getClaimAttribute(refreshToken, "userIdx"));
    String role = JwtTokenUtils.getClaimAttribute(refreshToken, "role");

    LocalDateTime recentAccessProvideTime;

    //추가! userIdx로 refresh token 가져오고 존재 여부 파악하기
    RefreshToken rf = refreshTokenRepository.findById(String.valueOf(userIdx))
        .orElseThrow(() -> new BaseException(BaseResponseStatus.REFRESH_TOKEN_NOT_FOUND));

    //주어진 refresh token이 유효한지
    if (!JwtTokenUtils.isValidToken(refreshToken)) {
      deleteRefreshToken(String.valueOf(userIdx));
      throw new BaseException(BaseResponseStatus.REFRESH_TOKEN_EXPIRED);
    }



    //최근 엑세스토큰 공급시간이 ACCESSTOKEN유효시간 전이라면
    recentAccessProvideTime = rf.getAccessProvideTime();
    if (LocalDateTime.now()
        .isBefore(
            recentAccessProvideTime.plusMinutes((int) (JwtTokenUtils.DEV_ACCESS_PERIOD / 1000 * 60)))
    ) {
      deleteRefreshToken(String.valueOf(userIdx));
      throw new BaseException(BaseResponseStatus.DUPLICATE_LOGIN);
    }
    rf.setAccessProvideTime(LocalDateTime.now());
    refreshTokenRepository.save(rf);
    return JwtTokenUtils.allocateToken(userIdx, role).getAccessToken();
  }

  /**
   * 발급받은 userIdx를 Key값으로 refreshtoken Redis에 저장
   * 현재 리프레쉬 토큰 발급 상태이면 중복로그인 에러 발생
   *
   * @param userIdx
   * @param refreshToken
   * @author An Chae Lee
   */
  public void saveRefreshToken(Long userIdx, String refreshToken) {

      //로그인 중인지 확인
      if (refreshTokenRepository.findById(String.valueOf(userIdx)).isPresent()) {
        deleteRefreshToken(String.valueOf(userIdx));
        throw new BaseException(BaseResponseStatus.DUPLICATE_LOGIN);
      } else {
        refreshTokenRepository.
            save(
                RefreshToken.builder().
                    userIdx(String.valueOf(userIdx)).
                    refreshToken(refreshToken).
                    accessProvideTime(LocalDateTime.now()).
                    build()
            );
      }
  }

  /**
   * userIdx를 통해 redis에서 해당 refreshtoken 검색 후 삭제
   * @param userIdx
   * @author An Chae Lee
   */
  public void deleteRefreshToken(String userIdx) {
    RefreshToken rf = refreshTokenRepository.findById(userIdx)
        .orElseThrow(() -> new BaseException(BaseResponseStatus.REFRESH_TOKEN_NOT_FOUND));
    refreshTokenRepository.delete(rf);

  }

}