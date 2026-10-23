package com.fitbuddy.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * Exercise Data Transfer Object (DTO)
 *
 * Represents an exercise item returned by the /api/exercises REST endpoints.
 * Separates internal entity logic from the JSON contract consumed by the frontend.
 */
public class ExerciseDto {

    private String id;
    private String name;
    private String category;
    private String targetBodyPart;
    private String musclesTargeted;
    private String requiredEquipment;
    private String difficulty;
    private String sets;
    private String reps;
    private String restDuration;
    private List<String> instructions;
    private List<String> formTips;
    private String beginnerVariation;
    private List<String> fitnessGoals;
    private List<Integer> durations;
    private String iconType;

    public ExerciseDto() {
        this.instructions = new ArrayList<>();
        this.formTips = new ArrayList<>();
        this.fitnessGoals = new ArrayList<>();
        this.durations = new ArrayList<>();
    }

    public ExerciseDto(String id, String name, String category, String targetBodyPart,
                       String musclesTargeted, String requiredEquipment, String difficulty,
                       String sets, String reps, String restDuration, List<String> instructions,
                       List<String> formTips, String beginnerVariation, List<String> fitnessGoals,
                       List<Integer> durations, String iconType) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.targetBodyPart = targetBodyPart;
        this.musclesTargeted = musclesTargeted;
        this.requiredEquipment = requiredEquipment;
        this.difficulty = difficulty;
        this.sets = sets;
        this.reps = reps;
        this.restDuration = restDuration;
        this.instructions = instructions != null ? instructions : new ArrayList<>();
        this.formTips = formTips != null ? formTips : new ArrayList<>();
        this.beginnerVariation = beginnerVariation;
        this.fitnessGoals = fitnessGoals != null ? fitnessGoals : new ArrayList<>();
        this.durations = durations != null ? durations : new ArrayList<>();
        this.iconType = iconType;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTargetBodyPart() {
        return targetBodyPart;
    }

    public void setTargetBodyPart(String targetBodyPart) {
        this.targetBodyPart = targetBodyPart;
    }

    public String getMusclesTargeted() {
        return musclesTargeted;
    }

    public void setMusclesTargeted(String musclesTargeted) {
        this.musclesTargeted = musclesTargeted;
    }

    public String getRequiredEquipment() {
        return requiredEquipment;
    }

    public void setRequiredEquipment(String requiredEquipment) {
        this.requiredEquipment = requiredEquipment;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getSets() {
        return sets;
    }

    public void setSets(String sets) {
        this.sets = sets;
    }

    public String getReps() {
        return reps;
    }

    public void setReps(String reps) {
        this.reps = reps;
    }

    public String getRestDuration() {
        return restDuration;
    }

    public void setRestDuration(String restDuration) {
        this.restDuration = restDuration;
    }

    public List<String> getInstructions() {
        return instructions;
    }

    public void setInstructions(List<String> instructions) {
        this.instructions = instructions;
    }

    public List<String> getFormTips() {
        return formTips;
    }

    public void setFormTips(List<String> formTips) {
        this.formTips = formTips;
    }

    public String getBeginnerVariation() {
        return beginnerVariation;
    }

    public void setBeginnerVariation(String beginnerVariation) {
        this.beginnerVariation = beginnerVariation;
    }

    public List<String> getFitnessGoals() {
        return fitnessGoals;
    }

    public void setFitnessGoals(List<String> fitnessGoals) {
        this.fitnessGoals = fitnessGoals;
    }

    public List<Integer> getDurations() {
        return durations;
    }

    public void setDurations(List<Integer> durations) {
        this.durations = durations;
    }

    public String getIconType() {
        return iconType;
    }

    public void setIconType(String iconType) {
        this.iconType = iconType;
    }
}
