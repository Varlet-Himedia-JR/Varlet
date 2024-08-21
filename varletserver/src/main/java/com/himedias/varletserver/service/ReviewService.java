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
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;
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

    public void deleteReview(Integer rseq) throws IOException {
        Optional<Review> reviewOpt = rr.findById(rseq);
        if (reviewOpt.isPresent()) {
            Review review = reviewOpt.get();

            // Delete the review image file if it exists
            String reviewimg = review.getReviewimg();
            if (reviewimg != null && !reviewimg.isEmpty()) {
                File file = new File(reviewimg + File.separator + reviewimg);
                if (file.exists()) {
                    if (!file.delete()) {
                        throw new IOException("Failed to delete image file: " + reviewimg);
                    }
                }
            }

            // Delete the review record from the database
            rr.deleteById(rseq);
        } else {
            throw new RuntimeException("Review not found");
        }
    }

    public void updateReview(int rseq, Review review) {
        Optional<Review> existingReview = rr.findById(rseq);
        if (existingReview.isPresent()) {
            Review updatedReview = existingReview.get();
            updatedReview.setTitle(review.getTitle());
            updatedReview.setContent(review.getContent());
            updatedReview.setReviewimg(review.getReviewimg()); // 이미지가 제공된 경우 업데이트

            // indate를 현재 날짜로 수동 업데이트합니다.
            updatedReview.setIndate(new Timestamp(System.currentTimeMillis()));

            rr.save(updatedReview);
        } else {
            throw new RuntimeException("Review not found");
        }
    }

    public List<Review> getReviewsByUserId(String userid) {
        return rr.findByUserid(userid);
    }
    
}