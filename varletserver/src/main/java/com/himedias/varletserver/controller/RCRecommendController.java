package com.himedias.varletserver.controller;

import com.himedias.varletserver.dto.RCRcommend.RcrecommendInfo;
import com.himedias.varletserver.entity.Member;
import com.himedias.varletserver.entity.RCommunity;
import com.himedias.varletserver.entity.Rcrecommend;
import com.himedias.varletserver.service.RCRecommendService;
import jakarta.servlet.ServletContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/rcrecommend")
public class RCRecommendController {

    @Autowired
    private RCRecommendService rcs;

    @Value("${file.upload-dir}")
    private String uploadDir; // 파일이 저장될 디렉토리

    @PostMapping("/writeRecommend/{rnum}")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Integer> writeRecommend(
            @PathVariable("rnum") int rnum,
            @RequestParam("userid") String userid,
            @RequestParam("content") String content,
            @RequestParam(value = "saveimages", required = false
    ) List<String> files) {
        RCommunity rc = rcs.findRCommunityById(rnum);
        Member member = rcs.findMemberById(userid);

        Rcrecommend rcrecommend = new Rcrecommend();
        rcrecommend.setContent(content);
        rcrecommend.setRnum(rc);
        rcrecommend.setUserid(member);

        Rcrecommend savedRcrecommend = rcs.saveRcrecommend(rcrecommend, files);

        return Map.of("rcum", savedRcrecommend.getRcnum());
    }


    @Autowired
    private ServletContext context;

    @PostMapping("/fileup")
    public ResponseEntity<Map<String, Object>> imgup(
            @RequestParam("image") MultipartFile[] files) {
        Map<String, Object> result = new HashMap<>();
        Calendar today = Calendar.getInstance();
        long timestamp = today.getTimeInMillis();

        // ServletContext를 통해 실제 경로를 얻습니다.
        String uploadDirPath = context.getRealPath("/uploads");
        File uploadDirFile = new File(uploadDirPath);
        if (!uploadDirFile.exists()) {
            uploadDirFile.mkdirs(); // 디렉토리가 존재하지 않으면 생성합니다.
        }

        List<String> savedFilenames = new ArrayList<>();

        for (MultipartFile file : files) {
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                continue; // 파일명이 없는 경우 건너뜁니다.
            }

            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = originalFilename.substring(0, originalFilename.lastIndexOf("."));
            String saveFilename = filename + timestamp + extension;

            Path filePath = Paths.get(uploadDirFile.getAbsolutePath(), saveFilename);

            try {
                file.transferTo(filePath.toFile()); // 파일을 지정된 폴더에 저장
                savedFilenames.add(saveFilename);
            } catch (IOException e) {
                e.printStackTrace();
                result.put("error", "File upload failed: " + e.getMessage());
                return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        result.put("savefilenames", savedFilenames);  // 여러 파일명을 반환
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    @GetMapping("/getReplies/{rnum}")
    public HashMap<String, Object> rcrommendView(@PathVariable("rnum") int rnum) {
        HashMap<String, Object> result = new HashMap<>();
        List<RcrecommendInfo> recommendList = rcs.getRecommend(rnum);
        System.out.println("호출됨?!-----------------------------------------");
        result.put("recommend", recommendList);
        return result;
    }

    @DeleteMapping("/deleteReply/{rcnum}")
    public ResponseEntity<String> deleteRecommend(@PathVariable("rcnum") int rcnum) {
        try {
            rcs.deleteRcrecommend(rcnum);
            return ResponseEntity.ok("Reply deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reply not found or could not be deleted");
        }
    }
    @PostMapping("/updateReplyPicked/{rcnum}")
    public ResponseEntity<?> updateReplyPicked(@PathVariable int rcnum, @RequestBody HashMap<String, String> body) {
        String rpickedStr = body.get("rpicked");
        if (rpickedStr == null || (!rpickedStr.equals("Y") && !rpickedStr.equals("N"))) {
            return ResponseEntity.badRequest().body("Invalid rpicked value");
        }

        // String을 Character로 변환
        Character rpicked = rpickedStr.charAt(0);

        boolean result = rcs.updateReplyPicked(rcnum, rpicked);
        if (result) {
            return ResponseEntity.ok().body("Reply picked updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update reply picked");
        }
    }
}
