package com.fitbuddy.dto;

import java.time.LocalDateTime;

public class WorkoutRecordDto {

    private Long id;
    private String workoutName;
    private Integer durationMinutes;
    private Integer exercisesCompleted;
    private Integer setsCompleted;
    private Integer caloriesBurned;
    private LocalDateTime completedAt;
    private String notes;

    public WorkoutRecordDto() {
    }

    public WorkoutRecordDto(Long id, String workoutName, Integer durationMinutes, Integer exercisesCompleted, Integer setsCompleted, Integer caloriesBurned, LocalDateTime completedAt, String notes) {
        this.id = id;
        this.workoutName = workoutName;
        this.durationMinutes = durationMinutes;
        this.exercisesCompleted = exercisesCompleted;
        this.setsCompleted = setsCompleted;
        this.caloriesBurned = caloriesBurned;
        this.completedAt = completedAt;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWorkoutName() {
        return workoutName;
    }

    public void setWorkoutName(String workoutName) {
        this.workoutName = workoutName;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Integer getExercisesCompleted() {
        return exercisesCompleted;
    }

    public void setExercisesCompleted(Integer exercisesCompleted) {
        this.exercisesCompleted = exercisesCompleted;
    }

    public Integer getSetsCompleted() {
        return setsCompleted;
    }

    public void setSetsCompleted(Integer setsCompleted) {
        this.setsCompleted = setsCompleted;
    }

    public Integer getCaloriesBurned() {
        return caloriesBurned;
    }

    public void setCaloriesBurned(Integer caloriesBurned) {
        this.caloriesBurned = caloriesBurned;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
