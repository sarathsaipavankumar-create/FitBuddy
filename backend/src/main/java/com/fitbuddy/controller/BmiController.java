package com.fitbuddy.controller;

import com.fitbuddy.dto.ApiResponse;
import com.fitbuddy.dto.BmiLogRequest;
import com.fitbuddy.dto.BmiRecordDto;
import com.fitbuddy.entity.User;
import com.fitbuddy.service.BmiService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bmi")
public class BmiController {

    private final BmiService bmiService;

    public BmiController(BmiService bmiService) {
        this.bmiService = bmiService;
    }

    @PostMapping("/log")
    public ResponseEntity<ApiResponse<BmiRecordDto>> logBmi(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody BmiLogRequest request) {
        BmiRecordDto dto = bmiService.logBmi(currentUser, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("BMI logged successfully", dto));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<BmiRecordDto>>> getBmiHistory(
            @AuthenticationPrincipal User currentUser) {
        List<BmiRecordDto> history = bmiService.getHistory(currentUser);
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}
