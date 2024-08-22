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
    private String uploadDir; // 파일이 저장될 디렉토리 경로를 프로퍼티 파일에서 가져옴

    /**
     * 새로운 답글을 작성하는 엔드포인트입니다.
     * 게시글 ID와 사용자 ID, 내용을 받아 해당 게시글에 답글을 추가합니다.
     * 선택적으로 이미지 파일 경로도 받을 수 있습니다.
     */
    @PostMapping("/writeRecommend/{rnum}")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Integer> writeRecommend(
            @PathVariable("rnum") int rnum,
            @RequestParam("userid") String userid,
            @RequestParam("content") String content,
            @RequestParam(value = "saveimages", required = false) List<String> files) {

        // 게시글 정보 및 사용자 정보 조회
        RCommunity rc = rcs.findRCommunityById(rnum);
        Member member = rcs.findMemberById(userid);

        // 새로운 답글 엔티티 생성 및 필드 설정
        Rcrecommend rcrecommend = new Rcrecommend();
        rcrecommend.setContent(content);
        rcrecommend.setRnum(rc);
        rcrecommend.setUserid(member);

        // 답글을 저장하고, 파일이 있을 경우 파일 경로도 함께 저장
        Rcrecommend savedRcrecommend = rcs.saveRcrecommend(rcrecommend, files);

        // 저장된 답글의 ID를 반환
        return Map.of("rcum", savedRcrecommend.getRcnum());
    }

    @Autowired
    private ServletContext context;

    /**
     * 이미지 파일을 업로드하는 엔드포인트입니다.
     * 업로드된 파일을 지정된 디렉토리에 저장하고, 저장된 파일명을 반환합니다.
     */
    @PostMapping("/fileup")
    public ResponseEntity<Map<String, Object>> imgup(
            @RequestParam("image") MultipartFile[] files) {
        Map<String, Object> result = new HashMap<>();
        Calendar today = Calendar.getInstance();
        long timestamp = today.getTimeInMillis();

        // 실제 파일 저장 경로를 얻음
        String uploadDirPath = context.getRealPath("/uploads");
        File uploadDirFile = new File(uploadDirPath);
        if (!uploadDirFile.exists()) {
            uploadDirFile.mkdirs(); // 디렉토리가 존재하지 않으면 생성
        }

        List<String> savedFilenames = new ArrayList<>();

        for (MultipartFile file : files) {
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                continue; // 파일명이 없는 경우 건너뜀
            }

            // 파일 확장자 및 파일명을 이용해 고유한 파일명 생성
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = originalFilename.substring(0, originalFilename.lastIndexOf("."));
            String saveFilename = filename + timestamp + extension;

            // 파일을 저장할 경로 설정
            Path filePath = Paths.get(uploadDirFile.getAbsolutePath(), saveFilename);

            try {
                file.transferTo(filePath.toFile()); // 파일을 지정된 경로에 저장
                savedFilenames.add(saveFilename);
            } catch (IOException e) {
                e.printStackTrace();
                result.put("error", "File upload failed: " + e.getMessage());
                return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        // 저장된 파일명을 응답으로 반환
        result.put("savefilenames", savedFilenames);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * 특정 게시글에 대한 답글 목록을 조회하는 엔드포인트입니다.
     * 게시글 ID를 받아 해당 게시글에 달린 모든 답글을 반환합니다.
     */
    @GetMapping("/getReplies/{rnum}")
    public HashMap<String, Object> rcrommendView(@PathVariable("rnum") int rnum) {
        HashMap<String, Object> result = new HashMap<>();
        List<RcrecommendInfo> recommendList = rcs.getRecommend(rnum);
        System.out.println("호출됨?!-----------------------------------------"); // 디버깅용 메시지
        result.put("recommend", recommendList); // 답글 목록을 응답으로 반환
        return result;
    }

    /**
     * 특정 답글을 삭제하는 엔드포인트입니다.
     * 답글 ID를 받아 해당 답글을 삭제합니다.
     */
    @DeleteMapping("/deleteReply/{rcnum}")
    public ResponseEntity<String> deleteRecommend(@PathVariable("rcnum") int rcnum) {
        try {
            rcs.deleteRcrecommend(rcnum); // 답글 삭제
            return ResponseEntity.ok("Reply deleted successfully"); // 성공 메시지 반환
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reply not found or could not be deleted");
        }
    }

    /**
     * 답글의 채택 상태를 업데이트하는 엔드포인트입니다.
     * 답글 ID와 채택 상태를 받아 답글의 채택 여부를 업데이트하고, 채택 시 포인트를 지급합니다.
     */
    @PostMapping("/updateReplyPicked/{rcnum}")
    public ResponseEntity<?> updateReplyPicked(@PathVariable int rcnum, @RequestBody HashMap<String, String> body) {
        String rpickedStr = body.get("rpicked");
        if (rpickedStr == null || (!rpickedStr.equals("Y") && !rpickedStr.equals("N"))) {
            return ResponseEntity.badRequest().body("Invalid rpicked value"); // 유효하지 않은 값에 대한 에러 응답
        }

        // String을 Character로 변환
        char rpicked = rpickedStr.charAt(0);

        // 답글의 채택 상태 업데이트 및 포인트 지급 로직 실행
        boolean result = rcs.updateReplyPicked(rcnum, rpicked);
        if (result) {
            return ResponseEntity.ok().body("Reply picked updated and reward granted successfully"); // 성공 응답
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update reply picked"); // 실패 응답
        }
    }
}

