package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.RCRecommendRepository;
import com.himedias.varletserver.dto.RCRecommendDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * 추천 댓글 관련 비즈니스 로직을 처리하는 서비스 클래스
 */
@Service
public class RCRecommendService {

    @Autowired
    private RCRecommendRepository rcRecommendRepository;

}
