package com.himedias.varletserver.controller;

import com.google.gson.Gson;
import com.himedias.varletserver.dto.KakaoProfile;
import com.himedias.varletserver.dto.NaverProfile;
import com.himedias.varletserver.dto.OAuthToken;
import com.himedias.varletserver.entity.Member;
import com.himedias.varletserver.security.CustomSecurityConfig;
import com.himedias.varletserver.security.util.CustomJWTException;
import com.himedias.varletserver.security.util.JWTUtil;
import com.himedias.varletserver.service.MemberService;
import jakarta.servlet.ServletContext;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.net.ssl.HttpsURLConnection;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/member")
public class MemberController {

    @Value("${kakao.client_id}")
    private String kakao_id;
    @Value("${kakao.redirect_uri}")
    private String kakao_uri;
    @Autowired
    MemberService ms;

    @Autowired
    CustomSecurityConfig cc;


    // 카카오 로그인
    @RequestMapping("/kakaoStart")
    public @ResponseBody String kakaostart() {
        String a = "<script type='text/javascript'>"
                + "location.href='https://kauth.kakao.com/oauth/authorize?"
                + "client_id=" + kakao_id + "&"
                + "redirect_uri=" + kakao_uri + "&"
                + "response_type=code';" + "</script>";
        return a;
    }

    @RequestMapping("/kakaoLogin")
    public void kakaoLogin( HttpServletRequest request, HttpServletResponse response) throws IOException {
        String code = request.getParameter("code");
        String endpoint = "https://kauth.kakao.com/oauth/token";
        URL url = new URL(endpoint);
        String bodyData = "grant_type=authorization_code&";
        bodyData += "client_id=0d1c52079a64f14e109fa8b905caa368&";
        bodyData += "redirect_uri=http://localhost:8070/member/kakaoLogin&";
        bodyData += "code=" + code;

        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        conn.setDoOutput(true);
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream(), "UTF-8"));
        bw.write(bodyData);
        bw.flush();
        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
        String input = "";
        StringBuilder sb = new StringBuilder();
        while ((input = br.readLine()) != null) {
            sb.append(input);
        }
        Gson gson = new Gson();
        OAuthToken oAuthToken = gson.fromJson(sb.toString(), OAuthToken.class);
        String endpoint2 = "https://kapi.kakao.com/v2/user/me";
        URL url2 = new URL(endpoint2);

        HttpsURLConnection conn2 = (HttpsURLConnection) url2.openConnection();
        conn2.setRequestProperty("Authorization", "Bearer " + oAuthToken.getAccess_token());
        conn2.setDoOutput(true);
        BufferedReader br2 = new BufferedReader(new InputStreamReader(conn2.getInputStream(), "UTF-8"));
        String input2 = "";
        StringBuilder sb2 = new StringBuilder();
        while ((input2 = br2.readLine()) != null) {
            sb2.append(input2);
            System.out.println(input2);
        }
        Gson gson2 = new Gson();
        KakaoProfile kakaoProfile = gson2.fromJson(sb2.toString(), KakaoProfile.class);
        KakaoProfile.KakaoAccount ac = kakaoProfile.getAccount();
        KakaoProfile.KakaoAccount.Profile pf = ac.getProfile();
        System.out.println("id : " + kakaoProfile.getId());
        System.out.println("KakaoAccount-Email : " + ac.getEmail());
        System.out.println("Profile-Nickname : " + pf.getNickname());

        Member member = ms.getMemberBySnsid( kakaoProfile.getId() );
        PasswordEncoder pe = cc.passwordEncoder(); // 비밀번호 암호화도구
        if( member == null) {
            member = new Member();
            member.setUserid(ac.getEmail());
            member.setPwd(pe.encode("kakao"));
            member.setNickname(pf.getNickname());
            member.setEmail( ac.getEmail());
            member.setProvider( "kakao" );
            member.setSnsid( kakaoProfile.getId() );
            ms.insertMember(member);
        }
        String username = URLEncoder.encode(ac.getEmail(),"UTF-8");
        response.sendRedirect("http://localhost:3000/kakaosaveinfo/"+username);
    }

    // 네이버 로그인
    @Value("${spring.security.oauth2.client.registration.naver.client-id}")
    private String naver_id;
    @Value("${spring.security.oauth2.client.registration.naver.redirect-uri}")
    private String naver_uri;

    @RequestMapping("/naverStart")
    public @ResponseBody String naverStart() {
        String a = "<script type='text/javascript'>"
                + "location.href='https://nid.naver.com/oauth2.0/authorize?"
                + "client_id=" + naver_id + "&"
                + "redirect_uri=" + naver_uri + "&"
                + "response_type=code';" + "</script>";
        System.out.println( "Naver Client ID: " + naver_id + ", Redirect URI: " + naver_uri);
        return a;
    }
    @RequestMapping("/naverLogin")
    public void naverLogin( HttpServletRequest request, HttpServletResponse response) throws IOException {
        String code = request.getParameter("code");
        String endpoint = "https://nid.naver.com/oauth2.0/token";
        URL url = new URL(endpoint);
        String bodyData = "grant_type=authorization_code&";
        bodyData += "client_id=XA1m05Bk3ARhCxqbLUd7&";
        bodyData += "redirect_uri=http://localhost:8070/login/oauth2/code/naver&";
        bodyData += "code=" + code;

        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        conn.setDoOutput(true);
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream(), "UTF-8"));
        bw.write(bodyData);
        bw.flush();
        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
        String input = "";
        StringBuilder sb = new StringBuilder();
        while ((input = br.readLine()) != null) {
            sb.append(input);
        }
        Gson gson = new Gson();
        OAuthToken oAuthToken = gson.fromJson(sb.toString(), OAuthToken.class);
        String endpoint2 = "https://nid.naver.com/v2/user/me";
        URL url2 = new URL(endpoint2);

        HttpsURLConnection conn2 = (HttpsURLConnection) url2.openConnection();
        conn2.setRequestProperty("Authorization", "Bearer " + oAuthToken.getAccess_token());
        conn2.setDoOutput(true);
        BufferedReader br2 = new BufferedReader(new InputStreamReader(conn2.getInputStream(), "UTF-8"));
        String input2 = "";
        StringBuilder sb2 = new StringBuilder();
        while ((input2 = br2.readLine()) != null) {
            sb2.append(input2);
            System.out.println(input2);
        }
        Gson gson2 = new Gson();
        NaverProfile naverProfile = gson2.fromJson(sb2.toString(), NaverProfile.class);
        NaverProfile.NaverAccount nac = naverProfile.getAccount();
        NaverProfile.NaverAccount.Profile npf = nac.getProfile();
        System.out.println("id : " + naverProfile.getId());
        System.out.println("NaverAccount-Email : " + nac.getEmail());
        System.out.println("NaverProfile-Nickname : " + npf.getNickname());

        Member member = ms.getMemberBySnsid( naverProfile.getId() );
        PasswordEncoder pe = cc.passwordEncoder(); // 비밀번호 암호화도구
        if( member == null) {
            member = new Member();
            member.setUserid(nac.getEmail());
            member.setPwd(pe.encode("naver"));
            member.setNickname(npf.getNickname());
            member.setEmail( nac.getEmail());
            member.setProvider( "naver" );
            member.setSnsid( naverProfile.getId() );
            ms.insertMember(member);
        }
        String username = URLEncoder.encode(nac.getEmail(),"UTF-8");
        response.sendRedirect("http://localhost:3000/naversaveinfo/"+username);
    }





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
