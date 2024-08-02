package com.himedias.varletserver.controller;

import com.himedias.varletserver.dto.Paging;
import com.himedias.varletserver.entity.Review;
import com.himedias.varletserver.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;


@RestController
@RequestMapping("/review")
public class ReviewController {

    @Autowired
    ReviewService rs;

    @GetMapping("/reviewList/{p}")
    public HashMap<String,Object> reviewList( @PathVariable("p") int page ){
        HashMap<String, Object> result = new HashMap<String, Object>();

        Paging paging = new Paging();
        paging.setPage( page );
        paging.calPaging();

        List<Review> list = rs.getReviewList( paging );
        result.put("reviewList", list);
        result.put("paging", paging);
        return result;
    }

}
