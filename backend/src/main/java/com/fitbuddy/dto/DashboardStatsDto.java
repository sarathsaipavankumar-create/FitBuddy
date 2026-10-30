package com.fitbuddy.dto;

public class DashboardStatsDto {

    private long totalWorkouts;
    private int totalMinutes;
    private int totalCalories;
    private int streakDays;
    private Double currentWeight;
    private Double currentBmi;
    private String bmiCategory;
    private String fitnessGoal;

    public DashboardStatsDto() {
    }

    public DashboardStatsDto(long totalWorkouts, int totalMinutes, int totalCalories, int streakDays, Double currentWeight, Double currentBmi, String bmiCategory, String fitnessGoal) {
        this.totalWorkouts = totalWorkouts;
        this.totalMinutes = totalMinutes;
        this.totalCalories = totalCalories;
        this.streakDays = streakDays;
        this.currentWeight = currentWeight;
        this.currentBmi = currentBmi;
        this.bmiCategory = bmiCategory;
        this.fitnessGoal = fitnessGoal;
    }

    public long getTotalWorkouts() {
        return totalWorkouts;
    }

    public void setTotalWorkouts(long totalWorkouts) {
        this.totalWorkouts = totalWorkouts;
    }

    public int getTotalMinutes() {
        return totalMinutes;
    }

    public void setTotalMinutes(int totalMinutes) {
        this.totalMinutes = totalMinutes;
    }

    public int getTotalCalories() {
        return totalCalories;
    }

    public void setTotalCalories(int totalCalories) {
        this.totalCalories = totalCalories;
    }

    public int getStreakDays() {
        return streakDays;
    }

    public void setStreakDays(int streakDays) {
        this.streakDays = streakDays;
    }

    public Double getCurrentWeight() {
        return currentWeight;
    }

    public void setCurrentWeight(Double currentWeight) {
        this.currentWeight = currentWeight;
    }

    public Double getCurrentBmi() {
        return currentBmi;
    }

    public void setCurrentBmi(Double currentBmi) {
        this.currentBmi = currentBmi;
    }

    public String getBmiCategory() {
        return bmiCategory;
    }

    public void setBmiCategory(String bmiCategory) {
        this.bmiCategory = bmiCategory;
    }

    public String getFitnessGoal() {
        return fitnessGoal;
    }

    public void setFitnessGoal(String fitnessGoal) {
        this.fitnessGoal = fitnessGoal;
    }
}
