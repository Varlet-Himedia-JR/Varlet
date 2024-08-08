package com.himedias.varletserver;

import com.himedias.varletserver.security.CustomSecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
class VarletserverApplicationTests {

    @Autowired
    CustomSecurityConfig cc;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void contextLoads() {
        PasswordEncoder pe = cc.passwordEncoder();
        System.out.println("------제발------");
        System.out.println(pe.encode("1"));
        System.out.println(pe.encode("1111"));
    }
}
