package com.himedias.varletserver.controller;

import com.himedias.varletserver.entity.Payments;
import com.himedias.varletserver.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pay")
public class PayController {

    @Autowired
    PaymentService ps;

    @PostMapping("/payment/{userId}")
    public ResponseEntity<String> processPayment(
            @PathVariable("userId") String userId,
            @RequestBody Payments paymentRequest) {

        try {
            // 결제 처리 및 응답 생성
            ps.processPayment(userId, paymentRequest);

            // 성공 응답 반환
            return new ResponseEntity<>("Payment processed successfully.", HttpStatus.OK);
        } catch (Exception e) {
            // 오류 응답 반환
            return new ResponseEntity<>("Payment processing failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/payments/{userId}")
    public ResponseEntity<List<Payments>> getPayments(@PathVariable("userId") String userId) {
        try {
            List<Payments> payments = ps.getPaymentsByUserId(userId);
            return new ResponseEntity<>(payments, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}