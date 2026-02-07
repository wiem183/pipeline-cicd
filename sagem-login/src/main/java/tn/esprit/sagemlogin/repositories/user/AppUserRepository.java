package tn.esprit.sagemlogin.repositories.user;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.sagemlogin.entity.AppUser;

import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByUsername(String username);
}
