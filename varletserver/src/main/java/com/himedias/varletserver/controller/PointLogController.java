package com.himedias.varletserver.controller;

import com.himedias.varletserver.dto.PointLogDto;
import com.himedias.varletserver.service.PointLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 포인트 로그 관련 요청을 처리하는 컨트롤러 클래스
 */
@RestController
@RequestMapping("/pointlogs")
public class PointLogController {

    @Autowired
    private PointLogService pointLogService;



}
