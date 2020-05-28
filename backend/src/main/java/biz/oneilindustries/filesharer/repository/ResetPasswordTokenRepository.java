package biz.oneilindustries.filesharer.repository;

import biz.oneilindustries.filesharer.entity.PasswordResetToken;
import biz.oneilindustries.filesharer.entity.User;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResetPasswordTokenRepository extends CrudRepository<PasswordResetToken, Integer> {
    Optional<PasswordResetToken> getByUsername(User name);
    Optional<PasswordResetToken> getByToken(String token);
}
