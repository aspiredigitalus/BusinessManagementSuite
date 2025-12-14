package com.aspiredigital.system.controller;

import com.aspiredigital.system.dto.LoginRequest;
import com.aspiredigital.system.dto.UserResponse;
import com.aspiredigital.system.model.User;
import com.aspiredigital.system.security.UserPrincipal;
import com.aspiredigital.system.service.JwtService;
import com.aspiredigital.system.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtService jwtService,
                          UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getUsername(),
                    request.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userService.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("User not found"));

            String token = jwtService.generateToken(user);

            return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtService.createJwtCookie(token).toString())
                .body(UserResponse.fromUser(user));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        SecurityContextHolder.clearContext();

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, jwtService.createLogoutCookie().toString())
            .build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userService.findById(principal.getId())
            .orElse(null);

        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(UserResponse.fromUser(user));
    }
}
