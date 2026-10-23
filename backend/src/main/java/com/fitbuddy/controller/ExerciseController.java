package com.fitbuddy.controller;

import com.fitbuddy.dto.ExerciseDto;
import com.fitbuddy.exception.ResourceNotFoundException;
import com.fitbuddy.service.ExerciseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Exercise Controller
 *
 * REST Controller exposing public endpoints for the FitBuddy exercise catalogue:
 * - GET /api/exercises : Returns array of exercises (supports ?category= & ?equipment= & ?search=)
 * - GET /api/exercises/{id} : Returns a specific exercise by ID
 * - GET /api/exercises/categories : Returns the list of exercise categories
 */
@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {

    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    /**
     * GET /api/exercises
     * Returns a JSON array of exercises.
     * Consumed directly by frontend: const exercises = await response.json();
     */
    @GetMapping
    public ResponseEntity<List<ExerciseDto>> getAllExercises(
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "equipment", required = false) String equipment,
            @RequestParam(name = "search", required = false) String search
    ) {
        List<ExerciseDto> list = exerciseService.getExercises(category, equipment, search);
        return ResponseEntity.ok(list);
    }

    /**
     * GET /api/exercises/{id}
     * Returns detailed information for a single exercise.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ExerciseDto> getExerciseById(@PathVariable("id") String id) {
        return exerciseService.getExerciseById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise", "id", id));
    }

    /**
     * GET /api/exercises/categories
     * Returns the list of available workout categories.
     */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(exerciseService.getCategories());
    }
}
