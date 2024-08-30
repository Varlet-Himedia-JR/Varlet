package com.himedias.varletserver.controller;

import com.himedias.varletserver.dto.Paging;
import com.himedias.varletserver.entity.Contents;
import com.himedias.varletserver.entity.House;
import com.himedias.varletserver.service.ContentsService;
import com.himedias.varletserver.service.HouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/house")
public class HouseController {

    @Autowired
    HouseService hs;

    @GetMapping("/getHouse/{page}")
    public HashMap<String, Object> contentsList(@PathVariable("page") int page) {
        HashMap<String, Object> result = new HashMap<String, Object>();
        Paging paging = new Paging();
        paging.setPage(page);
        paging.setDisplayRow(10);
        paging.setSort(Sort.by(Sort.Order.desc("hseq")));
        Page<House> housePage = hs.getHouse(paging);

        paging.setTotalCount((int) housePage.getTotalElements());

        paging.calPaging();

        result.put("house", housePage.getContent());
        result.put("paging", paging);

        return result;
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchHouse(@RequestParam("query") String query) {
        List<House> house = hs.searchHouse(query); // 검색된 결과를 가져옵니다.
        Map<String, Object> result = new HashMap<>();
        result.put("house", house); // 리스트를 'house' 필드로 래핑합니다.
        return ResponseEntity.ok(result); // 객체 형태로 응답을 보냅니다.
    }

}
