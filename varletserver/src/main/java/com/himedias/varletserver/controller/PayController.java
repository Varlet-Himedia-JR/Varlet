//package com.himedias.varletserver.controller;
//
//import jakarta.annotation.PostConstruct;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.io.IOException;
//
//@RestController
//@Slf4j
//@RequiredArgsConstructor
//@RequestMapping("/order")
//public class PayController {
//
//    private final PaymentService ps;
//    private final RefundService rs;
//
//    private IamportClient iamportClient;
//
//    @Value("${imp.api.key}")
//    private String apiKey;
//
//    @Value("${imp.api.secretkey}")
//    private String secretKey;
//
//    @PostConstruct
//    public void init() {
//        this.iamportClient = new IamportClient(apiKey, secretKey);
//    }
//
//    @PostMapping("/payment")
//    public ResponseEntity<String> paymentComplete(@Login SessionUser sessionUser, @RequestBody List<OrderSaveDto> orderSaveDtos) throws IOException {
//        String orderNumber = String.valueOf(orderSaveDtos.get(0).getOrderNumber());
//        try {
//            Long userId = sessionUser.getUserIdNo();
//            paymentService.saveOrder(userId, orderSaveDtos);
//            log.info("결제 성공 : 주문 번호 {}", orderNumber);
//            return ResponseEntity.ok().build();
//        } catch (RuntimeException e) {
//            log.info("주문 상품 환불 진행 : 주문 번호 {}", orderNumber);
//            String token = refundService.getToken(apiKey, secretKey);
//            refundService.refundWithToken(token, orderNumber, e.getMessage());
//            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
//        }
//    }
//
//
//    @PostMapping("/payment/validation/{imp_uid}")
//    @ResponseBody
//    public IamportResponse<Payment> validateIamport(@PathVariable String imp_uid) {
//        IamportResponse<Payment> payment = iamportClient.paymentByImpUid(imp_uid);
//        log.info("결제 요청 응답. 결제 내역 - 주문 번호: {}", payment.getResponse().getMerchantUid());
//        return payment;
//    }
//}