package com.himedias.varletserver.controller;

import com.himedias.varletserver.dto.Paging;
import com.himedias.varletserver.entity.Qna;
import com.himedias.varletserver.service.QnaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/qna")
public class QnaController {

    @Autowired
    QnaService cs;

    @GetMapping("/qnaList/{page}")
    public HashMap<String,Object> qnalist(@PathVariable("page") int page){
        HashMap<String,Object> result = new HashMap<String,Object>();

        Paging paging = new Paging();
        paging.setPage(page);
        paging.calPaging();
        List<Qna> list = cs.getQnaList(paging);
        result.put("qnaList",list);
        result.put("paging",paging);
        return result;
    }
//
//    @PostMapping("/writeQna")
//    public HashMap<String,Object> writeQna(@RequestBody Qna qna){
//        cs.writeQna(qna);
//        return null;
//    }
//
//    @GetMapping("/getQnaView/{qseq}")
//    public HashMap<String, Object> getQnaView(@PathVariable("qseq") int qseq) {
//        HashMap<String, Object> result = new HashMap<>();
//        Qna qna = cs.getQnaView(qseq);
//        result.put("qna", qna);
//        return result;
//    }
//
//    @PostMapping("/passCheck")
//    public HashMap<String, Object> passCheck(@RequestParam("qseq") int qseq,
//                                             @RequestParam("inputPass") String inputPass) {
//        HashMap<String, Object> result = new HashMap<>();
//        Qna qna = cs.getQnaView(qseq);
//        if(qna.getPass().equals(inputPass)) result.put("msg","OK");
//        else result.put("msg","FAIL");
//
//        return result;
//    }


}

