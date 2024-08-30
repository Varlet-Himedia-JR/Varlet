package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.ReviewPreviewRepository;
import com.himedias.varletserver.dao.ReviewRepository;
import com.himedias.varletserver.dto.Paging;
import com.himedias.varletserver.entity.Review;
import com.himedias.varletserver.entity.Reviewpreview;
import com.himedias.varletserver.entity.ReviewSummary;
import com.himedias.varletserver.entity.Reviewimg;
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
import java.util.*;

@Service
@Transactional
public class ReviewService {

    @Autowired
    ReviewRepository rr;

    @Autowired
    ReviewPreviewRepository rpr;

    private static final String UPLOAD_DIR = "/uploads";

    public Page<ReviewSummary> getReviewList(Paging paging) {
        int pageNumber = paging.getPage() - 1; // PageRequest uses 0-based index
        int pageSize = paging.getDisplayRow();
        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Order.asc("rseq")));
        return rr.findAllBy(pageRequest);
    }

    public Page<Reviewpreview> getReviewPreviewList(Paging paging) {
        int pageNumber = paging.getPage() - 1; // PageRequest uses 0-based index
        int pageSize = paging.getDisplayRow();
        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Order.asc("rseq")));
        return rpr.findAllBy(pageRequest);
    }


    public Review writeReview(Review review) {
        rr.save(review);
        System.out.println("Saved Review rseq: " + review.getRseq());
        return review;
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

            if (review.getReviewimg() != null) {
                for (Reviewimg img : review.getReviewimg()) {
                    File file = new File(UPLOAD_DIR + "/uploads" + img.getIname());
                    if (file.exists() && !file.delete()) {
                        throw new IOException("Failed to delete image file: " + img.getIname());
                    }
                }
            }

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
            updatedReview.setReviewimg(review.getReviewimg());
            updatedReview.setIndate(new Timestamp(System.currentTimeMillis()));
            rr.save(updatedReview);
        } else {
            throw new RuntimeException("Review not found");
        }
    }

    /*public List<Review> getReviewsByUser(String userid) {
        return rr.findByUserid(userid);
    }*/

    public String saveFile(MultipartFile file) throws IOException {
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        File targetFile = new File(uploadDir, fileName);
        file.transferTo(targetFile);
        return fileName;
    }

    public List<Review> getAllReviews() {
        return rr.findAll();
    }


    public List<Review> reviewSearch(String query) {
        return rr.searchByMultipleFields(query);
    }

    public List<Reviewpreview> reviewPreviewSearch(String query) {  return rpr.searchByMultipleFields(query);  }

    public List<ReviewSummary> getReviewsByUser(String userid) {
        return rr.findByUserid(userid); // 작성자 ID로 모든 리뷰를 가져옴
    }



}
