package com.example.mockproject.Controller;

import com.example.mockproject.Config.Jwt.JwtUtils;
import com.example.mockproject.Constant.CommonConstant;
import com.example.mockproject.Dto.*;
import com.example.mockproject.Entity.Token;
import com.example.mockproject.Entity.User;
import com.example.mockproject.Service.Impl.UserServiceImpl;
import com.example.mockproject.Service.TokenService;
import com.example.mockproject.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    @Autowired
    private UserService  userService;
    @Autowired
    private UserServiceImpl userServiceimpl;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private TokenService tokenService;
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody JwtRequest authenticationRequest) {
        try {
            authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword());
            final UserDetails userDetails = userServiceimpl.loadUserByUsername(authenticationRequest.getUsername());
            final String token = jwtUtils.generateToken(userDetails);
            final String refreshToken=jwtUtils.generateRefreshToken();
            User user = userService.findByUsername(authenticationRequest.getUsername());
            tokenService.saveToken(user,refreshToken);
            HttpHeaders headers = new HttpHeaders();
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("accessToken", token);
            responseBody.put("refreshToken", refreshToken);
            responseBody.put("department", user.getDepartment());
            responseBody.put("username", user.getUsername());
            responseBody.put("id", user.getId());
            return new ResponseEntity<>(responseBody, headers, HttpStatus.OK);
        } catch (DisabledException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is inactive");
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    private void authenticate(String username, String password) throws Exception {
        try {
            User user = userServiceimpl.findByUsername(username);
            if (user == null) {
                throw new BadCredentialsException("User not found");
            }
            if (user.getStatus().toString().equals("inactive")) {
                throw new DisabledException("User is inactive");
            }
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException | BadCredentialsException e) {
            throw e;
        } catch (Exception e) {
            throw new Exception("Authentication failed", e);
        }
    }


    @PostMapping("forgot")
    public ResponseEntity<?> forgetPassword(HttpServletResponse response, @RequestBody String email) {
        System.out.println(email);
        DataResponse resp = new DataResponse();
        String res = userService.forgotPassword(email);
        resp.setStatus(res);
        if (res.equals(CommonConstant.EMAIL_DONT_EXIST)) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resp);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("resetpassword")
    public ResponseEntity<?> resetPassword(HttpServletResponse response, @RequestBody NewPasswordRequest newPasswordReq) {
        DataResponse resp = new DataResponse();
        boolean res = userService.resetPassword(newPasswordReq);
        if (res) resp.setStatus("OK");
        else resp.setStatus("NG");
        return ResponseEntity.ok(resp);
    }
    @GetMapping("/info")
    public ResponseEntity<?> getUserInfo(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String username = jwtUtils.getUsernameFromToken(token);

        User user = userService.findByUsername(username);
        if (user != null) {
            UserDto userDto = new UserDto();
            userDto.setUsername(user.getUsername());
            userDto.setDepartment(user.getDepartment());
            userDto.setId(user.getId());
            return ResponseEntity.ok(userDto);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) {
        String refreshToken = request.getHeader("Authorization");
        if (refreshToken != null && refreshToken.startsWith("Bearer ")) {
            refreshToken = refreshToken.substring(7);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token is null");
        }
        Token token = tokenService.getToken(refreshToken);
        if (token == null || !token.isActive() || token.getExpiredRefreshDate().before(new Date())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }
        User user = token.getUser();
        final UserDetails userDetails = userServiceimpl.loadUserByUsername(user.getUsername());
        final String newToken = jwtUtils.generateToken(userDetails);
        final String newrefreshToken=jwtUtils.generateRefreshToken();
        tokenService.setAllAcitveFalse(user.getUsername());
        tokenService.saveToken( user, newrefreshToken);
        HttpHeaders headers = new HttpHeaders();
        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("accessToken", newToken);
        responseBody.put("refreshToken", newrefreshToken);
        return new ResponseEntity<>(responseBody, headers, HttpStatus.OK);
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody UserDto userDto) {
        tokenService.setAllAcitveFalse(userDto.getUsername());
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok().build();
    }
}
