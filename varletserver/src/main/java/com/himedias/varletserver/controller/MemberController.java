package com.himedias.varletserver.controller;

import com.himedias.varletserver.entity.Member;
import com.himedias.varletserver.security.CustomSecurityConfig;
import com.himedias.varletserver.security.util.CustomJWTException;
import com.himedias.varletserver.security.util.JWTUtil;
import com.himedias.varletserver.service.MemberService;
import jakarta.servlet.ServletContext;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/member")
public class MemberController {

    @Autowired
    MemberService ms;

    @PostMapping("/useridCheck")
    public HashMap<String, Object> useridCheck( @RequestParam("userid") String userid ){
        HashMap<String, Object> result = new HashMap<String, Object>();
        Member mem = ms.getMember( userid );
        if( mem != null ) result.put("msg", "no");
        else result.put("msg", "yes");
        return result;
    }

    @PostMapping("/nicknameCheck")
    public HashMap<String, Object> nicknameCheck( @RequestParam("nickname") String nickname){
        HashMap<String, Object> result = new HashMap<String, Object>();
        Member mem = ms.getMemberByNickname( nickname );
        if( mem != null ) result.put("msg", "no");
        else result.put("msg", "yes");
        return result;
    }

    @Autowired
    CustomSecurityConfig cc;

    @PostMapping("/join")
    public HashMap<String, Object> join( @RequestBody Member member){
        HashMap<String, Object> result = new HashMap<String, Object>();
        PasswordEncoder pe = cc.passwordEncoder();
        member.setPwd(pe.encode(member.getPwd()));
        ms.insertMember(member);
        result.put("msg", "ok");
        return result;
    }




    @Autowired
    ServletContext context;

    @PostMapping("/fileupload")
    public HashMap<String, Object> fileupload(@RequestParam("image") MultipartFile file){

        HashMap<String, Object> result = new HashMap<String, Object>();
        String path = context.getRealPath("/uploads");

        Calendar today = Calendar.getInstance();
        long dt = today.getTimeInMillis();
        String filename = file.getOriginalFilename();
        String fn1 = filename.substring(0, filename.indexOf(".") );
        String fn2 = filename.substring(filename.indexOf(".") );
        String uploadPath = path + "/" + fn1 + dt + fn2;

        try {
            file.transferTo( new File(uploadPath) );
            result.put("filename", fn1 + dt + fn2);
        } catch (IllegalStateException | IOException e) {
            e.printStackTrace();
        }
        return result;
    }




    @GetMapping("/refresh/{refreshToken}")
    public Map<String, Object> refresh(@RequestHeader("Authorization") String authHeader,
                                       @PathVariable("refreshToken") String refreshToken
    ) throws CustomJWTException {
        System.out.println("refreshtoken on refresh"+refreshToken);
        if(refreshToken == null ) throw new CustomJWTException("NULL_REFRASH");
        if(authHeader == null || authHeader.length() < 7 )
            throw new CustomJWTException("INVALID_HEADER");

        // 추출하는 내용의 7번째 글자부터 끝까지 추출합니다
        String accessToken = authHeader.substring(7);

        if(!checkExpiredToken(accessToken)){ // 기간이 지나면 true, 안지났으면 false 리턴
            return Map.of("access_token",accessToken,"refresh_token",refreshToken);
        }
        // accessToken 기간 만료시 refresh 토큰으로 재 검증하여 사용자 정보 추출
        Map<String,Object> claims = JWTUtil.validateToken(refreshToken);

        // 토큰 교체
        String newAccessToken = JWTUtil.generateToken(claims,1);
        String newRefreshToken = "";
        if( checkTime((Integer)claims.get("exp"))){
            newRefreshToken = JWTUtil.generateToken(claims,60*24);
        }else{
            newRefreshToken = refreshToken;
        }

        return Map.of("access_token",newAccessToken,"refresh_token",newRefreshToken);
    }

    private boolean checkTime(Integer exp) {
        java.util.Date expDate = new java.util.Date((long)exp*(1000)); // 밀리초로 변환
        long gap = expDate.getTime() - System.currentTimeMillis(); // 현재 시간과의 차이 계산
        long leftMin = gap / (1000*60);  // 분단위 변환
        // 1시간도 안남았는지
        return leftMin < 60;
    }

    private boolean checkExpiredToken(String accessToken) {
        try {
            JWTUtil.validateToken(accessToken);
        }catch( CustomJWTException ex ){
            if(ex.getMessage().equals("Expired")){
                return true;
            }
        }
        return false;
    }

}
