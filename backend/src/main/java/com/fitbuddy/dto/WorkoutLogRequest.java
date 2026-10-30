package com.fitbuddy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class WorkoutLogRequest {

    @NotBlank(message = "Workout name is required")
    private String workoutName;

    @NotNull(message = "Duration in minutes is required")
    @Positive(message = "Duration must be greater than 0")
    private Integer durationMinutes;

    private Integer exercisesCompleted;
    private Integer setsCompleted;
    private Integer caloriesBurned;
    private String notes;

    public WorkoutLogRequest() {
    }

    public WorkoutLogRequest(String workoutName, Integer durationMinutes, Integer exercisesCompleted, Integer setsCompleted, Integer caloriesBurned, String notes) {
        this.workoutName = workoutName;
        this.durationMinutes = durationMinutes;
        this.exercisesCompleted = exercisesCompleted;
        this.setsCompleted = setsCompleted;
        this.caloriesBurned = caloriesBurned;
        this.notes = notes;
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
