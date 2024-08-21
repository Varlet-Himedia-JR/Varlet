package com.himedias.varletserver.security;


import com.himedias.varletserver.security.filter.JWTCheckFilter;
import com.himedias.varletserver.security.handler.APILoginFailHandler;
import com.himedias.varletserver.security.handler.APILoginSuccessHandler;
import com.himedias.varletserver.security.handler.CustomAccessDeniedHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration // 이 클래스를 스프링 컨테이너로 사용하겠다.
@RequiredArgsConstructor // @Autowired 보다 더 강력한 자동 주입 어너테이션
@Log4j2 // security 에서 제공해주는 log 출력 기능을 사용하겠습니다.
public class CustomSecurityConfig {

    @Bean
    public SecurityFilterChain FilterChain(HttpSecurity http) throws Exception {
        // security 시스템이 발동 후 가장 먼저 찾아 실행하는 메소드(Bean)
        log.info("------security config start------------");
        // security Config 를 전체적으로 구성(설정)합니다.

        // CORS(Cross-Origin Resource Sharing) 설정
        // 서버가 다른 곳들끼리 통신을 하고 있는 가운데 그들간의 통신을 제약을 두는 설정
        // 서버가 서로 다른 출처 간의 통신을 제어하는 설정입니다.
        http.cors(
                httpSecurityCorsConfigurer->{
                    httpSecurityCorsConfigurer.configurationSource(corsConfigurationSource());
                }
        );

        // CSRF (Cross-Site Request Forgery) : 리퀘스트 위조방지 설정
        // CSRF의 취약점은 공격자가 "사용자가 의도하지 않는 요청" 을 수행하게 하는 취약점입니다.
        // CSRF는 공격자가 사용자가 의도하지 않은 요청을 서버에 보내는 공격입니다.
        // 토큰 사용으로 어느정도 안전한 환경을 구성할 수 있으므로 disabled()
        // CSRF 토큰을 사용하여 보안을 강화할 수 있으므로, 이 설정에서는 CSRF를 비활성화합니다.
        http.csrf(config -> config.disable());

        // 세션에 상태저장을 하지 않을 환경 설정
        // 세션을 상태 비저장으로 설정합니다.
        http.sessionManagement(
                sessionConfig->sessionConfig.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );
        // 로그인 처리 설정
        http.formLogin(config -> {
            config.loginPage("/member/loginlocal"); // loadUserByUsername 자동호출
            config.successHandler(new APILoginSuccessHandler()); // 로그인 성공시 실행할 코드를 가진 클래스
            config.failureHandler(new APILoginFailHandler()); // 로그인 실패시 실행할 코드를 가진 클래스
        });
        // JWT 엑세스 토큰 체크
        http.addFilterBefore(new JWTCheckFilter(),
                UsernamePasswordAuthenticationFilter.class);

        // 접근시 발생한 예외 처리(엑세스 토큰 오류, 로그인 오류 등등
         http.exceptionHandling(config ->{
           config.accessDeniedHandler(new CustomAccessDeniedHandler());
         });

        return http.build();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    // : cross-origin HTTP 요청들을 제한합니다
    // 그래서 cross-origin 요청을 하려면 서버의 동의가 필요합니다.
    // 만약 서버가 동의한다면 브라우저에서는 요청을 허락하고, 동의하지 않는다면 브라우저에서 거절합니다.
    // cross-origin 요청을 제한하며, 서버가 동의하지 않으면 브라우저에서 요청을 거절합니다.
    // 이러한 허락을 구하고 거절하는 메커니즘을 HTTP-header를 이용해서 가능한데,
    // 이를 CORS(Cross-Origin Resource Sharing)이라고 부릅니다
    // 그래서 브라우저에서 cross-orgin 요청을 안전하게 할 수 있도록 하는 메커니즘입니다.
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*")); // 모든 출처를 허용합니다
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // 허용된 HTTP 메서드입니다.
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type")); // 허용된 HTTP 헤더입니다.
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**",configuration); // 모든 경로에 대해 CORS 설정을 등록합니다.
        return source;
    }
}

