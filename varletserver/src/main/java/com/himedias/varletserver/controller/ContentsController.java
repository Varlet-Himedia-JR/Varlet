package com.himedias.varletserver.controller;

import com.himedias.varletserver.dto.Paging;
import com.himedias.varletserver.entity.Contents;
import com.himedias.varletserver.entity.Member;
import com.himedias.varletserver.entity.Qna;
import com.himedias.varletserver.entity.Timetable;
import com.himedias.varletserver.service.ContentsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/contents")
public class ContentsController {
    @Autowired
    ContentsService cs;

    @GetMapping("/contentsList/{page}")
    public HashMap<String,Object> contentsList(@PathVariable("page") int page){
        HashMap<String,Object> result = new HashMap<String,Object>();
        Paging paging = new Paging();
        paging.setPage(page);
        paging.setDisplayRow(10);
        paging.setSort(Sort.by(Sort.Order.desc("cseq")));
        Page<Contents> contentsPage = cs.getContentsList(paging);
        paging.setTotalCount((int) contentsPage.getTotalElements());
        paging.calPaging();

        result.put("contentsList", contentsPage.getContent());
        result.put("paging",paging);

        return result;

    }

    @GetMapping("/getContentsView/{cseq}")
    public HashMap<String,Object> getQnaView(@PathVariable("cseq") int cseq){
        HashMap<String, Object> result = new HashMap<>();
        Contents contents = cs.getQnaView(cseq);
        contents.toString();
        result.put("contents", contents);
        return result;
    }




}
