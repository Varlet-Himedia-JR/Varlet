package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.ReplyRepository;
import com.himedias.varletserver.dao.ReviewRepository;
import com.himedias.varletserver.dto.Paging;
import com.himedias.varletserver.entity.Reply;
import com.himedias.varletserver.entity.Review;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ReviewService {

    @Autowired
    ReviewRepository rr;

    @Autowired
    ReplyRepository re;

    public Page<Review> getReviewList(Paging paging) {
        int pageNumber = paging.getPage() - 1; // PageRequest uses 0-based index
        int pageSize = paging.getDisplayRow();
        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Order.desc("indate")));
        return rr.findAll(pageRequest);
    }

    public void writeReview(Review review) {
        rr.save(review);
    }

    public Optional<Review> findById(Integer rseq) {
        return rr.findById(rseq);
    }

    public void incrementReadcount(Integer rseq) {
        Review review = rr.findById(rseq).orElseThrow(() -> new RuntimeException("Review not found"));
        review.setReadcount(review.getReadcount() + 1);
        rr.save(review);
    }

    public void deleteReview(Integer rseq) {
        rr.deleteById(rseq);
    }

    public void updateReview(int rseq, Review updatedReview) throws Exception {
        if (!rr.existsById(rseq)) {
            throw new Exception("Review not found");
        }

        Review existingReview = rr.findById(rseq).orElseThrow(() -> new Exception("Review not found"));

        existingReview.setTitle(updatedReview.getTitle());
        existingReview.setContent(updatedReview.getContent());
        existingReview.setReviewimg(updatedReview.getReviewimg());
        existingReview.setIndate(new Timestamp(System.currentTimeMillis())); // Update date to current time

        rr.save(existingReview);
    }

    // 댓글 관련 기능 추가

    public List<Reply> getReplies(int rseq) {
        return re.findByRseq(rseq);
    }

    public void addReply(Reply reply) {
        re.save(reply);
    }

    public void deleteReply(int renum) {
        re.deleteById(renum);
    }
}
