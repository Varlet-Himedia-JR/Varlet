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
@RequestMapping("/api/pointlogs")
public class PointLogController {

    @Autowired
    private PointLogService pointLogService;

    @GetMapping("/{userid}")
    public List<PointLogDto> getLogsByUserid(@PathVariable String userid) {
        return pointLogService.getLogsByUserid(userid);
    }

    @GetMapping
    public List<PointLogDto> getAllLogs() {
        return pointLogService.getAllLogs();
    }

    @PostMapping
    public PointLogDto createLog(@RequestBody PointLogDto pointLogDto) {
        return pointLogService.saveLog(pointLogDto);
    }

    @DeleteMapping("/{lnum}")
    public void deleteLog(@PathVariable int lnum) {
        pointLogService.deleteLog(lnum);
    }
}
