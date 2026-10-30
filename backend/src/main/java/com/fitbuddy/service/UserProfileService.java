package com.fitbuddy.service;

import com.fitbuddy.dto.ProfileDto;
import com.fitbuddy.entity.BmiRecord;
import com.fitbuddy.entity.User;
import com.fitbuddy.entity.UserProfile;
import com.fitbuddy.repository.BmiRecordRepository;
import com.fitbuddy.repository.UserProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserProfileService {

    private final UserProfileRepository profileRepository;
    private final BmiRecordRepository bmiRecordRepository;

    public UserProfileService(UserProfileRepository profileRepository, BmiRecordRepository bmiRecordRepository) {
        this.profileRepository = profileRepository;
        this.bmiRecordRepository = bmiRecordRepository;
    }

    public ProfileDto getProfile(User user) {
        UserProfile profile = profileRepository.findByUser(user)
                .orElseGet(() -> profileRepository.save(new UserProfile(user)));
        return toDto(profile);
    }

    @Transactional
    public ProfileDto updateProfile(User user, ProfileDto dto) {
        UserProfile profile = profileRepository.findByUser(user)
                .orElseGet(() -> new UserProfile(user));

        if (dto.getAge() != null) profile.setAge(dto.getAge());
        if (dto.getGender() != null) profile.setGender(dto.getGender());
        if (dto.getHeight() != null) profile.setHeight(dto.getHeight());
        if (dto.getWeight() != null) profile.setWeight(dto.getWeight());
        if (dto.getActivityLevel() != null) profile.setActivityLevel(dto.getActivityLevel());
        if (dto.getFitnessGoal() != null) profile.setFitnessGoal(dto.getFitnessGoal());
        if (dto.getEquipment() != null) profile.setEquipment(dto.getEquipment());
        if (dto.getDietPreference() != null) profile.setDietPreference(dto.getDietPreference());
        if (dto.getWorkoutExperience() != null) profile.setWorkoutExperience(dto.getWorkoutExperience());
        if (dto.getWorkoutDuration() != null) profile.setWorkoutDuration(dto.getWorkoutDuration());

        if (profile.getHeight() != null && profile.getHeight() > 0 && profile.getWeight() != null && profile.getWeight() > 0) {
            double hM = profile.getHeight() / 100.0;
            double bmi = Math.round((profile.getWeight() / (hM * hM)) * 10.0) / 10.0;
            profile.setBmi(bmi);
            profile.setBmiCategory(UserProfile.determineBmiCategory(bmi));

            // Record BMI entry in history
            BmiRecord bmiRecord = new BmiRecord(user, profile.getHeight(), profile.getWeight(), bmi, profile.getBmiCategory());
            bmiRecordRepository.save(bmiRecord);
        }

        profile = profileRepository.save(profile);
        return toDto(profile);
    }

    public ProfileDto toDto(UserProfile profile) {
        if (profile == null) return null;
        ProfileDto dto = new ProfileDto();
        dto.setAge(profile.getAge());
        dto.setGender(profile.getGender());
        dto.setHeight(profile.getHeight());
        dto.setWeight(profile.getWeight());
        dto.setActivityLevel(profile.getActivityLevel());
        dto.setFitnessGoal(profile.getFitnessGoal());
        dto.setEquipment(profile.getEquipment());
        dto.setDietPreference(profile.getDietPreference());
        dto.setWorkoutExperience(profile.getWorkoutExperience());
        dto.setWorkoutDuration(profile.getWorkoutDuration());
        dto.setBmi(profile.getBmi());
        dto.setBmiCategory(profile.getBmiCategory());
        return dto;
    }
}
