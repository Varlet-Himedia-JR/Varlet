package com.himedias.varletserver.controller;

import com.himedias.varletserver.dto.Paging;
import com.himedias.varletserver.entity.Qna;
import com.himedias.varletserver.service.QnaService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/qna")
public class QnaController {

    @Autowired
    QnaService qs;

    @GetMapping("/qnaList/{page}")
    public HashMap<String,Object> qnalist(@PathVariable("page") int page){
        HashMap<String,Object> result = new HashMap<String,Object>();

        Paging paging = new Paging();
        paging.setPage(page);
        paging.setDisplayRow(20);

        paging.setSort(Sort.by(Sort.Order.desc("indate")));
        Page<Qna> qnaPage = qs.getQnaList(paging);


        paging.setTotalCount((int) qnaPage.getTotalElements());
        paging.calPaging();

        // Prepare response
        result.put("qnaList", qnaPage.getContent());
        result.put("paging", paging);

        return result;

    }
    @PostMapping("/writeQna")
    public HashMap<String,Object> writeQna(@RequestBody Qna qna){
        qs.writeQna(qna);
        return null;
    }

    @GetMapping("/getQnaView/{qseq}")
    public HashMap<String,Object> getQnaView(@PathVariable("qseq") int qseq){
        HashMap<String, Object> result = new HashMap<>();
        Qna qna = qs.getQnaView(qseq);
        result.put("qna", qna);
        return result;
    }

    @PostMapping("/passCheck")
    public HashMap<String, Object> passCheck(@RequestParam("qseq") int qseq,
                                             @RequestParam("inputPass") String inputPass) {
        HashMap<String, Object> result = new HashMap<>();
        Qna qna = qs.getQnaView(qseq);
        if(qna.getPass().equals(inputPass)) result.put("msg","OK");
        else result.put("msg","FAIL");

        return result;
    }
    @DeleteMapping("/qnaDelete/{qseq}")
    public HashMap<String,Object> qnaDelete(@PathVariable("qseq") int qseq){
        qs.deleteQna(qseq);
        return null;
    }


}