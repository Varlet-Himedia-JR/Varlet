package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.PointRepository;
import com.himedias.varletserver.dto.PointDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * 포인트 관련 비즈니스 로직을 처리하는 서비스 클래스
 */
@Service
public class PointService {

    @Autowired
    private PointRepository pointRepository;


}
