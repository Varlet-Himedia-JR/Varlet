package com.himedias.varletserver.controller;

import com.himedias.varletserver.dto.PointDto;
import com.himedias.varletserver.service.PointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

/**
 * 포인트 관련 요청을 처리하는 컨트롤러 클래스
 */
@RestController
@RequestMapping("/points")
public class PointController {

    @Autowired
    private PointService pointService;


}

