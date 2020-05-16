package biz.oneilindustries.filesharer.repository;

import biz.oneilindustries.filesharer.entity.PasswordResetToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResetPasswordTokenRepository extends CrudRepository<PasswordResetToken, Integer> {
    PasswordResetToken getByUsername(String name);
    PasswordResetToken getByToken(String token);
}
