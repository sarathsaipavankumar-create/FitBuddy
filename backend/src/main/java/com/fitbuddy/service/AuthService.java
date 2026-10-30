package com.fitbuddy.service;

import com.fitbuddy.dto.AuthResponse;
import com.fitbuddy.dto.LoginRequest;
import com.fitbuddy.dto.ProfileDto;
import com.fitbuddy.dto.RegisterRequest;
import com.fitbuddy.dto.UserDto;
import com.fitbuddy.entity.AuthToken;
import com.fitbuddy.entity.User;
import com.fitbuddy.entity.UserProfile;
import com.fitbuddy.exception.ApiException;
import com.fitbuddy.exception.BadRequestException;
import com.fitbuddy.repository.AuthTokenRepository;
import com.fitbuddy.repository.UserProfileRepository;
import com.fitbuddy.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserProfileRepository profileRepository;
    private final AuthTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       UserProfileRepository profileRepository,
                       AuthTokenRepository tokenRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new BadRequestException("An account with this email address already exists.");
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User(email, hashedPassword, request.getFullName().trim());
        user = userRepository.save(user);

        // Initialize user profile
        UserProfile profile = new UserProfile(user);
        profileRepository.save(profile);
        user.setProfile(profile);

        // Generate auth token valid for 30 days
        AuthToken token = createTokenForUser(user);

        return new AuthResponse(token.getToken(), toDto(user));
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }

        AuthToken token = createTokenForUser(user);
        return new AuthResponse(token.getToken(), toDto(user));
    }

    public Optional<User> getUserByToken(String tokenStr) {
        if (tokenStr == null || tokenStr.trim().isEmpty()) {
            return Optional.empty();
        }

        return tokenRepository.findByToken(tokenStr.trim())
                .filter(t -> !t.isExpired())
                .map(AuthToken::getUser);
    }

    @Transactional
    public void logout(String tokenStr) {
        if (tokenStr != null && !tokenStr.trim().isEmpty()) {
            tokenRepository.deleteByToken(tokenStr.trim());
        }
    }

    private AuthToken createTokenForUser(User user) {
        String tokenStr = UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", "");
        LocalDateTime expiresAt = LocalDateTime.now().plusDays(30);
        AuthToken token = new AuthToken(tokenStr, user, expiresAt);
        return tokenRepository.save(token);
    }

    public UserDto toDto(User user) {
        if (user == null) return null;

        ProfileDto profileDto = null;
        UserProfile p = user.getProfile();
        if (p == null) {
            p = profileRepository.findByUser(user).orElse(null);
        }

        if (p != null) {
            profileDto = new ProfileDto();
            profileDto.setAge(p.getAge());
            profileDto.setGender(p.getGender());
            profileDto.setHeight(p.getHeight());
            profileDto.setWeight(p.getWeight());
            profileDto.setActivityLevel(p.getActivityLevel());
            profileDto.setFitnessGoal(p.getFitnessGoal());
            profileDto.setEquipment(p.getEquipment());
            profileDto.setDietPreference(p.getDietPreference());
            profileDto.setWorkoutExperience(p.getWorkoutExperience());
            profileDto.setWorkoutDuration(p.getWorkoutDuration());
            profileDto.setBmi(p.getBmi());
            profileDto.setBmiCategory(p.getBmiCategory());
        }

        return new UserDto(user.getId(), user.getEmail(), user.getFullName(), user.getCreatedAt(), profileDto);
    }
}
