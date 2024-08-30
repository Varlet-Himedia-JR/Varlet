package com.himedias.varletserver.controller;

import com.himedias.varletserver.dto.Paging;
import com.himedias.varletserver.dto.Rcommunity.RCommunityWrite;
import com.himedias.varletserver.entity.Contents;
import com.himedias.varletserver.entity.Member;
import com.himedias.varletserver.entity.Qna;
import com.himedias.varletserver.entity.Timetable;
import com.himedias.varletserver.service.ContentsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/contents")
public class ContentsController {
    @Autowired
    ContentsService cs;

    @GetMapping("/contentsList/{page}")
    public HashMap<String, Object> contentsList(@PathVariable("page") int page) {
        HashMap<String, Object> result = new HashMap<String, Object>();
        Paging paging = new Paging();
        paging.setPage(page);
        paging.setDisplayRow(10);
        paging.setSort(Sort.by(Sort.Order.desc("cseq")));

        Page<Contents> contentsPage = cs.getContentsList(paging);

        paging.setTotalCount((int) contentsPage.getTotalElements());

        paging.calPaging();

        result.put("contentsList", contentsPage.getContent());
        result.put("paging", paging);

        return result;

    }

    @GetMapping("/recentContentsList")
    public HashMap<String, Object> recentContentsList() {
        HashMap<String, Object> result = new HashMap<String, Object>();

        result.put("recentContentsList", cs.getRecentContents());

        return result;

    }

    @GetMapping("/getContentsView/{cseq}")
    public HashMap<String, Object> getQnaView(@PathVariable("cseq") int cseq) {
        HashMap<String, Object> result = new HashMap<>();
        Contents contents = cs.getQnaView(cseq);
        contents.toString();
        result.put("contents", contents);
        return result;
    }

    @PostMapping("/writeContents")
    public HashMap<String, Object> writeContents(@RequestBody Contents contents) {
        HashMap<String, Object> result = new HashMap<>();
        System.out.println(contents.toString());
        cs.writeContents(contents);
        result.put("msg", "ok");
        return result;
    }

    @PostMapping("/updateContents")
    public HashMap<String, Object> updateContents(@RequestBody Contents contents) {
        HashMap<String, Object> result = new HashMap<>();
        System.out.println(contents.toString());
        cs.updateContents(contents);
        result.put("msg", "ok");
        return result;
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchContents(@RequestParam("query") String query) {
        List<Contents> contentsList = cs.searchContents(query); // 검색된 결과를 가져옵니다.
        Map<String, Object> result = new HashMap<>();
        result.put("contentsList", contentsList); // 리스트를 'contentsList' 필드로 래핑합니다.
        return ResponseEntity.ok(result); // 객체 형태로 응답을 보냅니다.
    }

    @PostMapping("/deleteContents/{cseq}")
    public HashMap<String, Object> deleteDayschedule(@PathVariable("cseq") int cseq){
        HashMap<String, Object> result = new HashMap<String, Object>();
        cs.deleteContents(cseq);
        result.put("msg","ok");
        return result;
    }
}
