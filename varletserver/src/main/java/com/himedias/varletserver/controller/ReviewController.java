package com.himedias.varletserver.controller;

import com.himedias.varletserver.dto.Paging;
import com.himedias.varletserver.entity.Reply;
import com.himedias.varletserver.entity.Review;
import com.himedias.varletserver.service.ReviewService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/review")
public class ReviewController {

    @Autowired
    ReviewService rs;

    @GetMapping("/reviewList/{page}")
    public HashMap<String, Object> reviewList(@PathVariable("page") int page) {
        HashMap<String, Object> result = new HashMap<>();

        Paging paging = new Paging();
        paging.setPage(page);
        paging.setDisplayRow(10);
        paging.setSort(Sort.by(Sort.Order.desc("indate")));
        Page<Review> reviewPage = rs.getReviewList(paging);

        paging.setTotalCount((int) reviewPage.getTotalElements());
        paging.calPaging();

        result.put("reviewList", reviewPage.getContent());
        result.put("paging", paging);

        return result;
    }

    @PostMapping("/writeReview")
    public HashMap<String, Object> writeReview(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("userid") String userid) {

        HashMap<String, Object> result = new HashMap<>();

        try {
            // Review 객체 생성 및 필드 설정
            Review review = new Review();
            review.setTitle(title);
            review.setContent(content);
            review.setUserid(userid);

            // 리뷰 저장
            rs.writeReview(review);

            // 성공 응답 반환
            result.put("status", "success");
            result.put("review", review);
        } catch (Exception e) {
            // 예외 처리 및 실패 응답 반환
            result.put("status", "error");
            result.put("message", e.getMessage());
        }

        return result;
    }





    @GetMapping("/getReviewView/{rseq}")
    public HashMap<String, Object> getReviewView(@PathVariable Integer rseq) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            Review review = rs.findById(rseq).orElseThrow(() -> new RuntimeException("Review not found"));
            rs.incrementReadcount(rseq); // 조회수 증가
            result.put("status", "success");
            result.put("review", review);
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", e.getMessage());
        }
        return result;
    }

    @DeleteMapping("/reviewDelete/{rseq}")
    public HashMap<String, Object> deleteReview(@PathVariable Integer rseq) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            rs.deleteReview(rseq);
            result.put("status", "success");
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", e.getMessage());
        }
        return result;
    }

    @PostMapping("/updateReview/{rseq}")
    public HashMap<String, Object> updateReview(@PathVariable int rseq,
                                                @RequestBody Review review,
                                                HttpServletRequest request) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            rs.updateReview(rseq, review);
            HttpSession session = request.getSession();
            session.setAttribute("userid", review.getUserid()); // Update with the correct user ID if needed
            result.put("msg", "ok");
        } catch (Exception e) {
            result.put("msg", "error");
            result.put("message", e.getMessage());
        }
        return result;
    }

    @GetMapping("/getReplies/{rseq}")
    public ResponseEntity<HashMap<String, Object>> getReplies(@PathVariable int rseq) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            List<Reply> replies = rs.getReplies(rseq);
            result.put("status", "success");
            result.put("replies", replies);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }

    @PostMapping("/addReply")
    public ResponseEntity<HashMap<String, Object>> addReply(@RequestBody Reply reply) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            rs.addReply(reply);
            result.put("status", "success");
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }

    @DeleteMapping("/deleteReply/{renum}")
    public ResponseEntity<HashMap<String, Object>> deleteReply(@PathVariable int renum) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            rs.deleteReply(renum);
            result.put("status", "success");
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }
}
