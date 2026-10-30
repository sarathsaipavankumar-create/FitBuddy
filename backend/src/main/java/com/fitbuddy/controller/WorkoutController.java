package com.fitbuddy.controller;

import com.fitbuddy.dto.ApiResponse;
import com.fitbuddy.dto.WorkoutLogRequest;
import com.fitbuddy.dto.WorkoutRecordDto;
import com.fitbuddy.entity.User;
import com.fitbuddy.service.WorkoutService;
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
@RequestMapping("/api/workouts")
public class WorkoutController {

    private final WorkoutService workoutService;

    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    @PostMapping("/log")
    public ResponseEntity<ApiResponse<WorkoutRecordDto>> logWorkout(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody WorkoutLogRequest request) {
        WorkoutRecordDto dto = workoutService.logWorkout(currentUser, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Workout logged successfully", dto));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<WorkoutRecordDto>>> getWorkoutHistory(
            @AuthenticationPrincipal User currentUser) {
        List<WorkoutRecordDto> history = workoutService.getHistory(currentUser);
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}
