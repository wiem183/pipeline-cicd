package tn.esprit.sagemlogin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import tn.esprit.sagemlogin.entity.AppUser;
import tn.esprit.sagemlogin.entity.Role;
import tn.esprit.sagemlogin.repositories.user.AppUserRepository;
import tn.esprit.sagemlogin.security.JwtService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final AppUserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        UserDetails user = (UserDetails) auth.getPrincipal();
        String token = jwtService.generateToken(user.getUsername());

        return ResponseEntity.ok(new JwtResponse(token));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepo.findByUsername(request.username()).isPresent()) {
            return ResponseEntity.badRequest().body("Nom d'utilisateur déjà pris");
        }

        AppUser user = new AppUser();
        user.setUsername(request.username());
        user.setEmail(request.email());
        try {
            user.setRole(Role.valueOf(request.role().toUpperCase()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Role invalide");
        }
        user.setPassword(passwordEncoder.encode(request.password()));

        userRepo.save(user);

        return ResponseEntity.ok("Utilisateur créé avec succès");
    }
}

// DTO records
record AuthRequest(String username, String password) {}
record JwtResponse(String token) {}
record RegisterRequest(String username, String email, String password, String role) {}
