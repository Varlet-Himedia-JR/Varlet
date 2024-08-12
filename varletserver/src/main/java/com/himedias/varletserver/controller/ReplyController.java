package com.himedias.varletserver.controller;

import com.himedias.varletserver.entity.Reply;
import com.himedias.varletserver.service.ReplyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/reply")
public class ReplyController {

    @Autowired
    private ReplyService rs;

    @GetMapping("/getReplies/{rseq}")
    public HashMap<String, Object> getReplies(@PathVariable int rseq) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            List<Reply> replies = rs.getRepliesByReviewId(rseq);
            result.put("status", "success");
            result.put("replies", replies);
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", e.getMessage());
        }
        return result;
    }

    @PostMapping("/addReply")
    public HashMap<String, Object> addReply(@RequestBody Reply reply) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            rs.addReply(reply);
            result.put("status", "success");
            result.put("reply", reply);
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", e.getMessage());
        }
        return result;
    }

    @DeleteMapping("/deleteReply/{id}")
    public HashMap<String, Object> deleteReply(@PathVariable int id, @RequestBody HashMap<String, String> requestBody) {
        HashMap<String, Object> result = new HashMap<>();
        String userId = requestBody.get("userId"); // 요청 본문에서 userId를 가져옴

        try {
            boolean isDeleted = rs.deleteReply(id, userId);
            if (isDeleted) {
                result.put("status", "success");
                result.put("message", "댓글이 성공적으로 삭제되었습니다.");
            } else {
                result.put("status", "error");
                result.put("message", "댓글 삭제 권한이 없습니다.");
            }
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", e.getMessage());
        }
        return result;
    }


}
