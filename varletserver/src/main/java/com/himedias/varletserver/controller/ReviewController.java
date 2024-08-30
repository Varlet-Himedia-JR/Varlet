package com.himedias.varletserver.controller;

import com.himedias.varletserver.dto.Paging;
import com.himedias.varletserver.entity.Review;
import com.himedias.varletserver.entity.Reviewpreview;
import com.himedias.varletserver.entity.ReviewSummary;
import com.himedias.varletserver.entity.Reviewimg;
import com.himedias.varletserver.service.ReviewService;
import jakarta.servlet.ServletContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/review")
public class ReviewController {

    @Autowired
    ReviewService rs;

    @Value("${file.upload-dir}")
    private String uploadDir; // 파일이 저장될 디렉토리

    @Autowired
    private ServletContext context;

    @PostMapping("/fileupload")
    public ResponseEntity<Map<String, Object>> fileupload(@RequestParam("image") MultipartFile[] files) {
        Map<String, Object> result = new HashMap<>();
        List<String> savedFilenames = new ArrayList<>();
        String path = context.getRealPath("/uploads");

        Calendar today = Calendar.getInstance();
        long dt = today.getTimeInMillis();

        for (MultipartFile file : files) {
            String filename = file.getOriginalFilename();
            if (filename == null) {
                continue; // Skip files without a name
            }

            String fn1 = filename.substring(0, filename.indexOf("."));
            String fn2 = filename.substring(filename.indexOf("."));
            String uploadPath = path + "/" + fn1 + dt + fn2;

            try {
                file.transferTo(new File(uploadPath));
                savedFilenames.add(fn1 + dt + fn2);
            } catch (IllegalStateException | IOException e) {
                e.printStackTrace();
                result.put("error", "File upload failed: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
            }
        }

        result.put("savefilenames", savedFilenames);
        return ResponseEntity.ok(result);
    }


    @PostMapping("/writeReview")
    public ResponseEntity<Map<String, Object>> writeReview(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("userid") String userid,
            @RequestParam(value = "reviewimg", required = false) MultipartFile[] reviewimgs) {

        Map<String, Object> result = new HashMap<>();
        try {
            Review review = new Review();
            review.setTitle(title);
            review.setContent(content);
            review.setUserid(userid);

            // 리뷰 저장
            Review savedReview = rs.writeReview(review); // 리뷰 저장 후 반환된 엔티티

            if (reviewimgs != null && reviewimgs.length > 0) {
                // 파일 업로드
                ResponseEntity<Map<String, Object>> uploadResult = fileupload(reviewimgs);
                if (uploadResult.getStatusCode() == HttpStatus.INTERNAL_SERVER_ERROR) {
                    return uploadResult;
                }

                @SuppressWarnings("unchecked")
                List<String> filenames = (List<String>) uploadResult.getBody().get("savefilenames");

                List<Reviewimg> reviewImgList = filenames.stream().map(filename -> {
                    Reviewimg reviewImg = new Reviewimg();
                    reviewImg.setIpath("/uploads/" + filename);
                    reviewImg.setIname(filename);
                    reviewImg.setRseq(savedReview.getRseq()); // 연관된 리뷰의 rseq 설정
                    return reviewImg;
                }).collect(Collectors.toList());

                // 저장된 리뷰에 이미지 추가
                savedReview.setReviewimg(reviewImgList);
                rs.writeReview(savedReview); // 리뷰 업데이트
            }

            result.put("status", "success");
            result.put("review", savedReview);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "Failed to write review: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }




    @PostMapping("/updateReview/{rseq}")
    public ResponseEntity<Map<String, Object>> updateReview(
            @PathVariable int rseq,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "reviewimg", required = false) List<MultipartFile> reviewimgs) {

        Map<String, Object> result = new HashMap<>();
        try {
            Review review = rs.findById(rseq).orElseThrow(() -> new RuntimeException("Review not found"));

            review.setTitle(title);
            review.setContent(content);

            // 기존 이미지 삭제
            if (review.getReviewimg() != null) {
                for (Reviewimg img : review.getReviewimg()) {
                    File file = new File(context.getRealPath("/" + uploadDir) + "/" + img.getIname());
                    if (file.exists()) {
                        file.delete();
                    }
                }
                review.getReviewimg().clear();
            }

            // 새 이미지 업로드
            if (reviewimgs != null && !reviewimgs.isEmpty()) {
                ResponseEntity<Map<String, Object>> uploadResult = fileupload(reviewimgs.toArray(new MultipartFile[0]));
                if (uploadResult.getStatusCode() == HttpStatus.INTERNAL_SERVER_ERROR) {
                    result.put("status", "error");
                    result.put("message", "File upload failed during review update.");
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
                }

                @SuppressWarnings("unchecked")
                List<String> filenames = (List<String>) uploadResult.getBody().get("savefilenames");

                List<Reviewimg> reviewImgList = filenames.stream().map(filename -> {
                    Reviewimg reviewImg = new Reviewimg();
                    reviewImg.setIpath("/" + uploadDir + "/" + filename);
                    reviewImg.setIname(filename);
                    return reviewImg;
                }).collect(Collectors.toList());

                review.setReviewimg(reviewImgList);
            }

            rs.updateReview(rseq, review);

            result.put("status", "success");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }



    @GetMapping("/getReviewView/{rseq}")
    public ResponseEntity<Map<String, Object>> getReviewView(@PathVariable Integer rseq) {
        Map<String, Object> result = new HashMap<>();
        try {
            Review review = rs.findById(rseq).orElseThrow(() -> new RuntimeException("Review not found"));
            rs.incrementReadcount(rseq); // 조회수 증가

            Map<String, Object> reviewData = new HashMap<>();
            reviewData.put("rseq", review.getRseq());
            reviewData.put("userid", review.getUserid());
            reviewData.put("title", review.getTitle());
            reviewData.put("content", review.getContent());
            reviewData.put("indate", review.getIndate());
            reviewData.put("readcount", review.getReadcount());
            reviewData.put("reviewimg", review.getReviewimg().stream()
                    .map(img -> {
                        Map<String, Object> imgData = new HashMap<>();
                        imgData.put("iseq", img.getIseq());
                        imgData.put("rseq", img.getRseq());
                        imgData.put("ipath", img.getIpath());
                        imgData.put("iname", img.getIname());
                        return imgData;
                    })
                    .collect(Collectors.toList()));

            result.put("status", "success");
            result.put("review", reviewData);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }



    @DeleteMapping("/reviewDelete/{rseq}")
    public ResponseEntity<Map<String, Object>> deleteReview(@PathVariable Integer rseq) {
        Map<String, Object> result = new HashMap<>();
        try {
            Review review = rs.findById(rseq).orElseThrow(() -> new RuntimeException("Review not found"));

            if (review.getReviewimg() != null) {
                for (Reviewimg img : review.getReviewimg()) {
                    File file = new File(context.getRealPath(uploadDir) + "/" + img.getIname());
                    if (file.exists()) {
                        file.delete();
                    }
                }
            }

            rs.deleteReview(rseq); // 리뷰 삭제
            result.put("status", "success");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "Failed to delete review: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }


    /*@GetMapping("/api/review/reviewList")
    public ResponseEntity<List<Review>> getReviewsByUser (@RequestParam String userid){
        try {
            List<Review> reviews = rs.getReviewsByUserId(userid);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }*/

    @GetMapping("/reviewList/{page}")
    public HashMap<String, Object> reviewList(@PathVariable("page") int page) {
        HashMap<String, Object> result = new HashMap<>();
        Paging paging = new Paging();
        paging.setPage(page);
        paging.setDisplayRow(10);
        paging.setSort(Sort.by(Sort.Order.desc("rseq")));

        Page<ReviewSummary> reviewPage = rs.getReviewList(paging);

        paging.setTotalCount((int) reviewPage.getTotalElements());

        paging.calPaging();

        result.put("reviewList", reviewPage.getContent());
        result.put("paging", paging);

        return result;
    }

    @GetMapping("/reviewSearch")
    public ResponseEntity<Map<String, Object>> reviewSearch(@RequestParam("query") String query) {
        List<Review> reviewList = rs.reviewSearch(query);
        Map<String, Object> result = new HashMap<>();
        result.put("reviewList", reviewList);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/reviewPreviewSearch")
    public ResponseEntity<Map<String, Object>> reviewPreviewSearch(@RequestParam("query") String query) {
        List<Reviewpreview> reviewpreviewList = rs.reviewPreviewSearch(query);
        Map<String, Object> result = new HashMap<>();
        result.put("reviewList", reviewpreviewList);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/userReviews/{userid}")
    public HashMap<String, Object> userReviews(@PathVariable("userid") String userid) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            List<ReviewSummary> reviewList = rs.getReviewsByUser(userid); // 사용자에 대한 모든 리뷰를 가져옴
            result.put("reviewList", reviewList);
            result.put("status", "success");
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", e.getMessage());
        }
        return result;
    }

    @GetMapping("/reviewPreviewList/{page}")
    public HashMap<String, Object> reviewPreviewList(@PathVariable("page") int page) {
        HashMap<String, Object> result = new HashMap<>();
        Paging paging = new Paging();
        paging.setPage(page);
        paging.setDisplayRow(10);
        paging.setSort(Sort.by(Sort.Order.desc("rseq")));

        Page<Reviewpreview> reviewPreviewPage = rs.getReviewPreviewList(paging);

        paging.setTotalCount((int) reviewPreviewPage.getTotalElements());

        paging.calPaging();

        result.put("reviewList", reviewPreviewPage.getContent());
        result.put("paging", paging);

        return result;
    }
}