package com.fitbuddy.service;

import com.fitbuddy.dto.WorkoutLogRequest;
import com.fitbuddy.dto.WorkoutRecordDto;
import com.fitbuddy.entity.User;
import com.fitbuddy.entity.WorkoutRecord;
import com.fitbuddy.repository.WorkoutRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkoutService {

    private final WorkoutRecordRepository workoutRepository;

    public WorkoutService(WorkoutRecordRepository workoutRepository) {
        this.workoutRepository = workoutRepository;
    }

    @Transactional
    public WorkoutRecordDto logWorkout(User user, WorkoutLogRequest req) {
        WorkoutRecord record = new WorkoutRecord(
                user,
                req.getWorkoutName(),
                req.getDurationMinutes(),
                req.getExercisesCompleted(),
                req.getSetsCompleted(),
                req.getCaloriesBurned(),
                LocalDateTime.now(),
                req.getNotes()
        );
        record = workoutRepository.save(record);
        return toDto(record);
    }

    public List<WorkoutRecordDto> getHistory(User user) {
        return workoutRepository.findByUserOrderByCompletedAtDesc(user)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public WorkoutRecordDto toDto(WorkoutRecord w) {
        if (w == null) return null;
        return new WorkoutRecordDto(
                w.getId(),
                w.getWorkoutName(),
                w.getDurationMinutes(),
                w.getExercisesCompleted(),
                w.getSetsCompleted(),
                w.getCaloriesBurned(),
                w.getCompletedAt(),
                w.getNotes()
        );
    }
}
