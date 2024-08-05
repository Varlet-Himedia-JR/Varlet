package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.PointLogRepository;
import com.himedias.varletserver.dto.PointLogDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * 포인트 로그 관련 비즈니스 로직을 처리하는 서비스 클래스
 */
@Service
public class PointLogService {

    @Autowired
    private PointLogRepository pointLogRepository;


}
