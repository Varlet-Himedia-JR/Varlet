package com.himedias.varletserver.service;

import com.himedias.varletserver.dao.ReviewRepository;
import com.himedias.varletserver.dto.Paging;
import com.himedias.varletserver.entity.Review;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@Transactional
public class ReviewService {

    @Autowired
    ReviewRepository rr;

    public List<Review> getReviewList(Paging paging) {
        Pageable pageable = PageRequest.of(paging.getPage() - 1, paging.getDisplayRow());

        // 데이터베이스에서 리뷰 목록 조회
        return rr.findAll(pageable).getContent();
    }
}
