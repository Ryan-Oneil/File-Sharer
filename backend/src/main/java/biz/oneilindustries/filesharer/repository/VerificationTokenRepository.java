package biz.oneilindustries.filesharer.repository;

import biz.oneilindustries.filesharer.entity.User;
import biz.oneilindustries.filesharer.entity.VerificationToken;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VerificationTokenRepository extends CrudRepository<VerificationToken, Integer> {
    Optional<VerificationToken> findByToken(String token);
    Optional<VerificationToken> findByUsername(User user);
}
