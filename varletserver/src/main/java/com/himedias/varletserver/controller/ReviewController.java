package com.himedias.varletserver.controller;

import com.himedias.varletserver.dao.ReviewRepository;
import com.himedias.varletserver.dto.Paging;
import com.himedias.varletserver.entity.Review;
import com.himedias.varletserver.entity.Reviewimg;
import com.himedias.varletserver.service.ReviewService;
import jakarta.servlet.ServletContext;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Timestamp;
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
    public ResponseEntity<Map<String, Object>> fileupload(
            @RequestParam("image") MultipartFile[] files) {
        Map<String, Object> result = new HashMap<>();
        Calendar today = Calendar.getInstance();
        long timestamp = today.getTimeInMillis();

        String uploadDirPath = context.getRealPath("/uploads" + uploadDir);
        File uploadDirFile = new File(uploadDirPath);
        if (!uploadDirFile.exists()) {
            uploadDirFile.mkdirs();
        }

        List<String> savedFilenames = new ArrayList<>();

        for (MultipartFile file : files) {
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                continue;
            }

            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = originalFilename.substring(0, originalFilename.lastIndexOf("."));
            String saveFilename = filename + timestamp + extension;

            Path filePath = Paths.get(uploadDirFile.getAbsolutePath(), saveFilename);

            try {
                file.transferTo(filePath.toFile());
                savedFilenames.add(saveFilename);
            } catch (IOException e) {
                e.printStackTrace();
                result.put("error", "File upload failed: " + e.getMessage());
                return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        result.put("savefilenames", savedFilenames);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    @PostMapping("/writeReview")
    public ResponseEntity<Map<String, Object>> writeReview(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("userid") String userid,
            @RequestParam(value = "reviewimg", required = false) List<MultipartFile> reviewimgs) {

        Map<String, Object> result = new HashMap<>();
        try {
            Review review = new Review();
            review.setTitle(title);
            review.setContent(content);
            review.setUserid(userid);

            if (reviewimgs != null && !reviewimgs.isEmpty()) {
                // Call fileupload method
                ResponseEntity<Map<String, Object>> uploadResult = fileupload(reviewimgs.toArray(new MultipartFile[0]));
                if (uploadResult.getStatusCode() == HttpStatus.INTERNAL_SERVER_ERROR) {
                    return uploadResult;
                }

                @SuppressWarnings("unchecked")
                List<String> filenames = (List<String>) uploadResult.getBody().get("savefilenames");

                List<Reviewimg> reviewImgList = filenames.stream().map(filename -> {
                    Reviewimg reviewImg = new Reviewimg();
                    reviewImg.setIpath("/" + uploadDir + "/uploads" + filename); // Update the path to match the upload directory
                    reviewImg.setIname(filename);
                    return reviewImg;
                }).collect(Collectors.toList());

                review.setReviewimg(reviewImgList);
            }

            rs.writeReview(review);

            result.put("status", "success");
            result.put("review", review);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "Failed to write review: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }

    @PostMapping("/updateReview/{rseq}")
    public ResponseEntity<Map<String, Object>> updateReview(@PathVariable int rseq,
                                                            @RequestParam("title") String title,
                                                            @RequestParam("content") String content,
                                                            @RequestParam(value = "reviewimg", required = false) List<MultipartFile> reviewimgs) {
        Map<String, Object> result = new HashMap<>();
        try {
            Review review = rs.findById(rseq).orElseThrow(() -> new RuntimeException("Review not found"));

            review.setTitle(title);
            review.setContent(content);

            if (reviewimgs != null && !reviewimgs.isEmpty()) {
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
            result.put("status", "success");
            result.put("review", review);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }

        @DeleteMapping("/reviewDelete/{rseq}")
        public ResponseEntity<Map<String, Object>> deleteReview (@PathVariable Integer rseq){
            Map<String, Object> result = new HashMap<>();
            try {
                // 리뷰를 삭제하고 연결된 이미지도 삭제
                Review review = rs.findById(rseq).orElseThrow(() -> new RuntimeException("Review not found"));

                // 이미지 파일 삭제
                if (review.getReviewimg() != null) {
                    for (Reviewimg img : review.getReviewimg()) {
                        File file = new File(context.getRealPath("/" + uploadDir) + "/" + img.getIname());
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

        @GetMapping("/api/review/reviewList")
        public ResponseEntity<List<Review>> getReviewsByUser (@RequestParam String userid){
            try {
                List<Review> reviews = rs.getReviewsByUserId(userid);
                return ResponseEntity.ok(reviews);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        }

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
}