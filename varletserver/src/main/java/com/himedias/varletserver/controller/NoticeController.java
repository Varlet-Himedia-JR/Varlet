package com.himedias.varletserver.controller;

import com.himedias.varletserver.dto.Paging;
import com.himedias.varletserver.entity.Notice;
import com.himedias.varletserver.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/notice")
public class NoticeController {

    @Autowired
    NoticeService ns;

    @GetMapping("/noticeList/{page}")
    public HashMap<String,Object> noticeList(@PathVariable("page") int page){
        HashMap<String,Object> result = new HashMap<String,Object>();

        Paging paging = new Paging();
        paging.setPage(page);
        paging.setDisplayRow(20);

        paging.setSort(Sort.by(Sort.Order.desc("indate")));
        Page<Notice> noticePage = ns.getNoticeList(paging);


        paging.setTotalCount((int) noticePage.getTotalElements());
        paging.calPaging();

        // Prepare response
        result.put("noticeList", noticePage.getContent());
        result.put("paging", paging);

        return result;

    }

    @GetMapping("/getNoticeView/{nseq}")
    public HashMap<String,Object> getNoticeView(@PathVariable("nseq") int nseq){
        HashMap<String, Object> result = new HashMap<>();
        Notice notice = ns.getNoticeView(nseq);
        result.put("notice", notice);
        return result;
    }


}
