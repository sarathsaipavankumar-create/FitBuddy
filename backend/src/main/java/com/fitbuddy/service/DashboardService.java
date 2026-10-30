package com.fitbuddy.service;

import com.fitbuddy.dto.DashboardStatsDto;
import com.fitbuddy.entity.ProgressRecord;
import com.fitbuddy.entity.User;
import com.fitbuddy.entity.UserProfile;
import com.fitbuddy.entity.WorkoutRecord;
import com.fitbuddy.repository.ProgressRecordRepository;
import com.fitbuddy.repository.UserProfileRepository;
import com.fitbuddy.repository.WorkoutRecordRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class DashboardService {

    private final WorkoutRecordRepository workoutRepository;
    private final ProgressRecordRepository progressRepository;
    private final UserProfileRepository profileRepository;

    public DashboardService(WorkoutRecordRepository workoutRepository,
                            ProgressRecordRepository progressRepository,
                            UserProfileRepository profileRepository) {
        this.workoutRepository = workoutRepository;
        this.progressRepository = progressRepository;
        this.profileRepository = profileRepository;
    }

    public DashboardStatsDto getStats(User user) {
        long totalWorkouts = workoutRepository.countByUser(user);
        int totalMinutes = workoutRepository.sumDurationMinutesByUser(user);
        int totalCalories = workoutRepository.sumCaloriesBurnedByUser(user);

        // Fetch user profile for weight, BMI, goal
        UserProfile profile = profileRepository.findByUser(user).orElse(null);
        Double currentWeight = (profile != null) ? profile.getWeight() : null;
        Double currentBmi = (profile != null) ? profile.getBmi() : null;
        String bmiCategory = (profile != null) ? profile.getBmiCategory() : null;
        String fitnessGoal = (profile != null) ? profile.getFitnessGoal() : null;

        // Calculate workout streak
        int streakDays = calculateStreak(user);

        return new DashboardStatsDto(
                totalWorkouts,
                totalMinutes,
                totalCalories,
                streakDays,
                currentWeight,
                currentBmi,
                bmiCategory,
                fitnessGoal
        );
    }

    private int calculateStreak(User user) {
        List<WorkoutRecord> workouts = workoutRepository.findByUserOrderByCompletedAtDesc(user);
        if (workouts.isEmpty()) {
            return 0;
        }

        Set<LocalDate> activeDates = new HashSet<>();
        for (WorkoutRecord w : workouts) {
            if (w.getCompletedAt() != null) {
                activeDates.add(w.getCompletedAt().toLocalDate());
            }
        }

        List<ProgressRecord> progressList = progressRepository.findByUserOrderByLogDateDesc(user);
        for (ProgressRecord p : progressList) {
            if (p.getLogDate() != null) {
                activeDates.add(p.getLogDate());
            }
        }

        LocalDate current = LocalDate.now();
        // If no activity today, check if yesterday was active
        if (!activeDates.contains(current)) {
            current = current.minusDays(1);
            if (!activeDates.contains(current)) {
                return 0;
            }
        }

        int streak = 0;
        while (activeDates.contains(current)) {
            streak++;
            current = current.minusDays(1);
        }

        return streak;
    }
}
