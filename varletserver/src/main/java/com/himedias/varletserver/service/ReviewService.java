package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.ReviewRepository;
import com.himedias.varletserver.dto.Paging;
import com.himedias.varletserver.entity.Review;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Transactional
public class ReviewService {

    @Autowired
    ReviewRepository rr;

    public Page<Review> getReviewList(Paging paging) {
        int pageNumber = paging.getPage() - 1; // PageRequest uses 0-based index
        int pageSize = paging.getDisplayRow();
        PageRequest pageRequest = PageRequest.of(paging.getPage() - 1, paging.getDisplayRow(), Sort.by(Sort.Order.desc("indate")));
        // Pageable pageable = PageRequest.of(pageNumber, pageSize);
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

   /* public Optional<Review> updateReview(int rseq) {
        rr.
    }*/
}
