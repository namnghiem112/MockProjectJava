package com.example.mockproject.Controller;

import com.example.mockproject.Config.Jwt.JwtUtils;
import com.example.mockproject.Dto.AccountEmailDto;
import com.example.mockproject.Dto.UserDto;
import com.example.mockproject.Entity.User;
import com.example.mockproject.Entity.num.Role;
import com.example.mockproject.Repository.UserRepository;
import com.example.mockproject.Service.MailService;
import com.example.mockproject.Service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private MailService emailService;
    @GetMapping
    public ResponseEntity<?> getAllUser(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) String username) {
        try {
            Page<UserDto> userDtos = userService.getListUser(page, size, role,username);
            return ResponseEntity.ok(userDtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable int id) {
        try {
            UserDto userDto = userService.getUserByID(id);
            if (userDto == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            return ResponseEntity.ok(userDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> registerAccount(@RequestBody @Valid UserDto userDto) {
        try {
            return ResponseEntity.ok(userService.register(userDto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody @Valid UserDto userDto) {
        try {
            return ResponseEntity.ok(userService.updateUser(id, userDto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/activate/{id}")
    public ResponseEntity<?> activeUser(@PathVariable int id) {
        try {
            userService.activeUser(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/inactivate/{id}")
    public ResponseEntity<?> inactiveUser(@PathVariable int id) {
        try {
            userService.inactiveUser(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    @PostMapping("/sendEmail")
    public ResponseEntity<?> sendEmail(@RequestBody @Valid AccountEmailDto AccountEmailDto) {
        String recruiterEmail = "admin@gmail.com";
        emailService.sendAccountCreatedEmail(AccountEmailDto.getTo(), AccountEmailDto.getUsername(), AccountEmailDto.getPassword(), recruiterEmail);
        return ResponseEntity.ok().build();
    }
}
