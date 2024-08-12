package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.ReplyRepository;
import com.himedias.varletserver.entity.Reply;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReplyService {

    @Autowired
    private ReplyRepository rr;

    public List<Reply> getRepliesByReviewId(int rseq) {
        return rr.findByRseq(rseq);
    }

    public void addReply(Reply reply) {
        rr.save(reply);
    }

    public boolean deleteReply(int renum, String userId) {
        // 댓글 조회
        Reply reply = rr.findById(renum).orElse(null);

        if (reply != null && reply.getUserid().equals(userId)) {
            // 댓글 작성자가 현재 사용자와 동일한 경우 삭제
            rr.deleteById(renum);
            return true;
        } else {
            // 댓글 작성자가 다를 경우 삭제 실패
            return false;
        }
    }
}
