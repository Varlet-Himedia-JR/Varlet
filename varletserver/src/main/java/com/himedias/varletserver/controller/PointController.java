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
@RequestMapping("/api/points")
public class PointController {

    @Autowired
    private PointService pointService;

    @GetMapping("/{userid}")
    public Optional<PointDto> getPointByUserid(@PathVariable String userid) {
        return pointService.getPointByUserid(userid);
    }

    @GetMapping
    public List<PointDto> getAllPoints() {
        return pointService.getAllPoints();
    }

    @PostMapping
    public PointDto createPoint(@RequestBody PointDto pointDto) {
        return pointService.savePoint(pointDto);
    }

    @DeleteMapping("/{pnum}")
    public void deletePoint(@PathVariable int pnum) {
        pointService.deletePoint(pnum);
    }
}

