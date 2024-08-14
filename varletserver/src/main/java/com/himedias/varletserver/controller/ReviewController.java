package com.himedias.varletserver.controller;

import com.himedias.varletserver.dto.Paging;
import com.himedias.varletserver.entity.Review;
import com.himedias.varletserver.service.ReviewService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/review")
public class ReviewController {

    @Autowired
    ReviewService rs;

    @GetMapping("/reviewList/{page}")
    public HashMap<String,Object> reviewList(@PathVariable("page") int page){
        HashMap<String,Object> result = new HashMap<String,Object>();

        Paging paging = new Paging();
        paging.setPage(page);
        paging.setDisplayRow(10);

        paging.setSort(Sort.by(Sort.Order.desc("indate")));
        Page<Review> reviewPage = rs.getReviewList(paging);


        paging.setTotalCount((int) reviewPage.getTotalElements());
        paging.calPaging();

        // Prepare response
        result.put("reviewList", reviewPage.getContent());
        result.put("paging", paging);

        return result;
    }

    @PostMapping("/writeReview")
    public HashMap<String, Object> writeReview(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("userid") String userid,
            @RequestParam(value = "reviewimg", required = false) MultipartFile reviewimg) { // 수정됨

        HashMap<String, Object> result = new HashMap<>();

        try {
            // Review 객체 생성 및 필드 설정
            Review review = new Review();
            review.setTitle(title);
            review.setContent(content);
            review.setUserid(userid);

            if (reviewimg != null && !reviewimg.isEmpty()) {
                String fileName = saveFile(reviewimg);
                review.setReviewimg(fileName);
            }

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
            rs.deleteReview(rseq); // This will now also delete the associated image
            result.put("status", "success");
        } catch (IOException e) {
            result.put("status", "error");
            result.put("message", "Failed to delete review image: " + e.getMessage());
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", e.getMessage());
        }
        return result;
    }

    @PostMapping("/updateReview/{rseq}")
    public HashMap<String, Object> updateReview(@PathVariable int rseq,
                                                @RequestParam("title") String title,
                                                @RequestParam("content") String content,
                                                @RequestParam(value = "reviewimg", required = false) MultipartFile file,
                                                HttpServletRequest request) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            Review review = rs.findById(rseq).orElseThrow(() -> new RuntimeException("Review not found"));

            review.setTitle(title);
            review.setContent(content);

            if (file != null && !file.isEmpty()) {
                // 새 파일을 저장하고 reviewimg 필드를 새로운 파일 이름으로 설정합니다.
                String fileName = saveFile(file);
                review.setReviewimg(fileName);
            }

            // 리뷰 업데이트 시 현재 날짜로 indate를 설정합니다.
            review.setIndate(new Timestamp(System.currentTimeMillis()));

            rs.updateReview(rseq, review);
            HttpSession session = request.getSession();
            session.setAttribute("userid", review.getUserid()); // 필요한 경우, 올바른 사용자 ID로 업데이트합니다.
            result.put("msg", "ok");
        } catch (Exception e) {
            result.put("msg", "error");
            result.put("message", e.getMessage());
        }
        return result;
    }



    private String saveFile(MultipartFile file) throws IOException {
        // Save the file to the local file system or cloud storage and return the file name
        String fileName = file.getOriginalFilename();
        File targetFile = new File("/images" + fileName);
        file.transferTo(targetFile);
        return fileName;
    }

    @GetMapping("/api/review/reviewList")
    public List<Review> getReviewsByUser(@RequestParam String userid) {
        return rs.getReviewsByUserId(userid);
    }



}