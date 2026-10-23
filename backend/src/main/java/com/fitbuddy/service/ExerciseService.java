package com.fitbuddy.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitbuddy.dto.ExerciseDto;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Exercise Service
 *
 * Manages the catalogue of exercises, providing search, category filtering,
 * and individual exercise retrieval for the FitBuddy application.
 */
@Service
public class ExerciseService {

    private static final Logger logger = LoggerFactory.getLogger(ExerciseService.class);

    private final ObjectMapper objectMapper;
    private final List<ExerciseDto> exercises = new ArrayList<>();

    public ExerciseService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /**
     * Initializes the exercise catalogue from classpath:data/exercises.json on startup.
     */
    @PostConstruct
    public void init() {
        try {
            ClassPathResource resource = new ClassPathResource("data/exercises.json");
            if (resource.exists()) {
                try (InputStream is = resource.getInputStream()) {
                    List<ExerciseDto> loaded = objectMapper.readValue(is, new TypeReference<List<ExerciseDto>>() {});
                    exercises.clear();
                    exercises.addAll(loaded);
                    logger.info("Successfully loaded {} exercises into ExerciseService catalogue", exercises.size());
                }
            } else {
                logger.warn("Classpath resource 'data/exercises.json' not found. Exercise list is empty.");
            }
        } catch (Exception e) {
            logger.error("Failed to load exercises from data/exercises.json: {}", e.getMessage(), e);
        }
    }

    /**
     * Retrieves all exercises, with optional category and equipment filtering.
     *
     * @param category  Optional category filter (e.g., 'Chest', 'Abs', or 'All')
     * @param equipment Optional equipment filter (e.g., 'No Equipment', 'Dumbbells', or 'All')
     * @param search    Optional keyword search
     * @return Filtered list of exercises
     */
    public List<ExerciseDto> getExercises(String category, String equipment, String search) {
        return exercises.stream()
                .filter(ex -> {
                    if (category == null || category.isBlank() || category.equalsIgnoreCase("All")) {
                        return true;
                    }
                    return ex.getCategory() != null && ex.getCategory().equalsIgnoreCase(category);
                })
                .filter(ex -> {
                    if (equipment == null || equipment.isBlank() || equipment.equalsIgnoreCase("All")) {
                        return true;
                    }
                    return ex.getRequiredEquipment() != null && ex.getRequiredEquipment().equalsIgnoreCase(equipment);
                })
                .filter(ex -> {
                    if (search == null || search.isBlank()) {
                        return true;
                    }
                    String q = search.toLowerCase();
                    return (ex.getName() != null && ex.getName().toLowerCase().contains(q))
                            || (ex.getTargetBodyPart() != null && ex.getTargetBodyPart().toLowerCase().contains(q))
                            || (ex.getMusclesTargeted() != null && ex.getMusclesTargeted().toLowerCase().contains(q));
                })
                .collect(Collectors.toList());
    }

    /**
     * Finds an individual exercise by its unique URL slug/ID (e.g., 'push-ups').
     *
     * @param id The unique identifier
     * @return Optional containing the exercise if found
     */
    public Optional<ExerciseDto> getExerciseById(String id) {
        if (id == null) {
            return Optional.empty();
        }
        return exercises.stream()
                .filter(ex -> ex.getId().equalsIgnoreCase(id))
                .findFirst();
    }

    /**
     * Returns the distinct list of all exercise categories.
     */
    public List<String> getCategories() {
        List<String> categories = new ArrayList<>();
        categories.add("All");
        categories.addAll(Arrays.asList(
                "Warm-up", "Chest", "Back", "Biceps", "Triceps", "Shoulders", "Abs", "Legs", "Full Body Circuit"
        ));
        return categories;
    }
}
