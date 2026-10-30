package com.fitbuddy.controller;

import com.fitbuddy.dto.ApiResponse;
import com.fitbuddy.dto.ProgressLogRequest;
import com.fitbuddy.dto.ProgressRecordDto;
import com.fitbuddy.entity.User;
import com.fitbuddy.service.ProgressService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @PostMapping("/log")
    public ResponseEntity<ApiResponse<ProgressRecordDto>> logProgress(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody ProgressLogRequest request) {
        ProgressRecordDto dto = progressService.logProgress(currentUser, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Progress entry logged successfully", dto));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<ProgressRecordDto>>> getProgressHistory(
            @AuthenticationPrincipal User currentUser) {
        List<ProgressRecordDto> history = progressService.getHistory(currentUser);
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProgress(
            @AuthenticationPrincipal User currentUser,
            @PathVariable("id") Long id) {
        progressService.deleteProgress(currentUser, id);
        return ResponseEntity.ok(ApiResponse.success("Progress entry deleted successfully", null));
    }
}
