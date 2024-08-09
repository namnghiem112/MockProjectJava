package com.example.mockproject.Service.Impl;

import com.example.mockproject.Config.UserDetailsImpl;
import com.example.mockproject.Constant.CommonConstant;
import com.example.mockproject.Dto.UserDto;
import com.example.mockproject.Dto.NewPasswordRequest;
import com.example.mockproject.Entity.User;
import com.example.mockproject.Entity.num.Role;
import com.example.mockproject.Entity.num.UserStatus;
import com.example.mockproject.Repository.UserRepository;
import com.example.mockproject.Service.MailService;
import com.example.mockproject.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.apache.commons.lang3.RandomStringUtils;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MailService mailService;

    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findUserByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException(username);
        }
        return new UserDetailsImpl(user);
    }

    @Override
    public UserDto register(UserDto userDto) {
        try {
            User user = new User();
            user.setFullname(userDto.getFullname());

            String usernameWithoutDiacritics = removeDiacritics(userDto.getFullname());
            int existingUsersCount = userRepository.findUserByFullname(userDto.getFullname()).size();

            String username;
            if (existingUsersCount > 0) {
                username = convertUsername(usernameWithoutDiacritics) + (existingUsersCount );
            } else {
                username = convertUsername(usernameWithoutDiacritics);
            }

            user.setUsername(username);
            String randomPassword = RandomStringUtils.randomAlphanumeric(10);
            user.setPassword(passwordEncoder.encode(randomPassword));
            user.setCreatedDate(userDto.getCreatedDate());
            user.setRole(userDto.getRole());
            user.setStatus(userDto.getStatus());
            user.setDepartment(userDto.getDepartment());
            user.setEmail(userDto.getEmail());
            user.setPhone(userDto.getPhone());
            user.setAddress(userDto.getAddress());
            user.setDob(userDto.getDob());
            user.setNote(userDto.getNote());
            user.setGender(userDto.getGender());

            userRepository.save(user);
            userDto.setUsername(user.getUsername());
            userDto.setPassword(randomPassword);
            return userDto;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }


    @Override
    public String forgotPassword(String email) {
        if (userRepository.findUserByEmail(email) == null) return CommonConstant.EMAIL_DONT_EXIST;
        String verifyKey = getVerifyKey();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime dateTimePlus15Minutes = now.plusMinutes(15);
        Date datePlus15Minutes = Date.from(dateTimePlus15Minutes.atZone(ZoneId.systemDefault()).toInstant());
        userRepository.updateTokenDetailsByEmail(email, verifyKey, new Date(), datePlus15Minutes);
        mailService.sendMailUpdatePassword(verifyKey, email);
        return CommonConstant.SUCCESS;
    }

    public String getVerifyKey() {
        UUID uuid = UUID.randomUUID();
        return uuid.toString();
    }

    @Override
    public boolean resetPassword(NewPasswordRequest newPasswordReq) {
        String verifyKey = newPasswordReq.getVerifyKey();
        if (verifyKey == null || verifyKey.isEmpty() || userRepository.getUserByToken(verifyKey) == 0 || isKeyExpired(verifyKey)) return false;
        String newPass = passwordEncoder.encode(newPasswordReq.getPassword());
        userRepository.updatePassword(newPass, newPasswordReq.getVerifyKey(), Date.from(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant()));
        return true;
    }

    @Override
    public boolean isKeyExpired(String verifyKey) {
        Date expiredDate = userRepository.getTokenExpiredDate(verifyKey);
        return expiredDate.before(new Date());
    }

    @Override
    public Page<UserDto> getListUser(int page, int size, Role role, String username) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> usersPage;

        if (username != null && !username.isEmpty() && role != null) {
            usersPage = userRepository.findUsersByUsernameContainingAndRole(username, role, pageable);
        } else if (username != null && !username.isEmpty()) {
            usersPage = userRepository.findUsersByUsernameContaining(username, pageable);
        } else if (role != null) {
            usersPage = userRepository.findUsersByRole(role, pageable);
        } else {
            usersPage = userRepository.findUsersExcludingRole(Role.ADMIN, pageable);
        }

        return usersPage.map(this::convertToDto);
    }





    @Override
    public UserDto updateUser(int id, UserDto userDto) {
        try {
            Optional<User> userOptional = userRepository.findById(id);
            if (userOptional.isPresent()) {
                User user = userOptional.get();

                if (!user.getStatus().equals(userDto.getStatus())) {
                    throw new RuntimeException("Status cannot be changed");
                }
                String randomPassword="";
                boolean isFullNameChanged = !user.getFullname().equals(userDto.getFullname());
                boolean isEmailChanged = !user.getEmail().equals(userDto.getEmail());
                String originFullName="";
                String originEmail="";
                if (isFullNameChanged) {
                    originFullName=user.getFullname();
                    user.setFullname(userDto.getFullname());
                    userDto.setFullname(originFullName);
                    String usernameWithoutDiacritics = removeDiacritics(user.getFullname());
                    int existingUsersCount = userRepository.findUserByFullname(user.getFullname()).size();
                    String username;
                    if (existingUsersCount > 0) {
                        username = convertUsername(usernameWithoutDiacritics) + (existingUsersCount);
                    } else {
                        username = convertUsername(usernameWithoutDiacritics);
                    }
                    user.setUsername(username);
                    randomPassword = RandomStringUtils.randomAlphanumeric(10);
                    user.setPassword(passwordEncoder.encode(randomPassword));
                }
                user.setCreatedDate(userDto.getCreatedDate());
                user.setRole(userDto.getRole());
                user.setDepartment(userDto.getDepartment());
                if (isEmailChanged) {
                    originEmail=user.getEmail();
                    user.setEmail(userDto.getEmail());
                    userDto.setEmail(originEmail);
                    userDto.setPassword(user.getPassword());
                    randomPassword = RandomStringUtils.randomAlphanumeric(10);
                    user.setPassword(passwordEncoder.encode(randomPassword));
                }
                user.setPhone(userDto.getPhone());
                user.setAddress(userDto.getAddress());
                user.setDob(userDto.getDob());
                user.setNote(userDto.getNote());
                user.setGender(userDto.getGender());
                userRepository.save(user);
                userDto.setUsername(user.getUsername());
                userDto.setPassword(randomPassword);
                return userDto;
            } else {
                throw new RuntimeException("User not found");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }




    @Override
    public void deleteUser(int id) {
        try {
            Optional<User> userOptional = userRepository.findById(id);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                userRepository.delete(user);
            } else {
                throw new RuntimeException("User not found");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public UserDto getUserByID(int id) {
        try {
            Optional<User> userOptional = userRepository.findById(id);
            if (userOptional.isPresent()) {
                return convertToDto(userOptional.get());
            } else {
                throw new RuntimeException("User not found");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public void activeUser(int id) {
        try {
            Optional<User> userOptional = userRepository.findById(id);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                user.setStatus(UserStatus.ACTIVE);
                userRepository.save(user);
            } else {
                throw new RuntimeException("User not found");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void inactiveUser(int id) {
        try {
            Optional<User> userOptional = userRepository.findById(id);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                user.setStatus(UserStatus.INACTIVE);
                userRepository.save(user);
            } else {
                throw new RuntimeException("User not found");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findUserByUsername(username);
    }

    private UserDto convertToDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setFullname(user.getFullname());
        userDto.setUsername(user.getUsername());
        userDto.setCreatedDate(user.getCreatedDate());
        userDto.setRole(user.getRole());
        userDto.setStatus(user.getStatus());
        userDto.setVerifyKey(user.getVerifyKey());
        userDto.setKeyCreated(user.getKeyCreated());
        userDto.setKeyExpired(user.getKeyExpired());
        userDto.setDepartment(user.getDepartment());
        userDto.setEmail(user.getEmail());
        userDto.setPhone(user.getPhone());
        userDto.setAddress(user.getAddress());
        userDto.setDob(user.getDob());
        userDto.setNote(user.getNote());
        userDto.setGender(user.getGender());
        return userDto;
    }

    private String convertUsername(String fullName) {
        String[] nameParts = fullName.trim().split("\\s+");
        String lastName = nameParts[nameParts.length - 1];
        StringBuilder initials = new StringBuilder();
        for (int i = 0; i < nameParts.length - 1; i++) {
            initials.append(nameParts[i].charAt(0));
        }
        return lastName.toUpperCase() + initials.toString().toUpperCase();
    }

    private String removeDiacritics(String str) {
        if (str == null) {
            return null;
        }
        String normalized = Normalizer.normalize(str, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String withoutDiacritics = pattern.matcher(normalized).replaceAll("").replaceAll("đ", "d").replaceAll("Đ", "D");
        return withoutDiacritics.replaceAll("[^a-zA-Z ]", "");
    }

}
