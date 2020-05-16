package biz.oneilindustries.filesharer.repository;

import biz.oneilindustries.filesharer.entity.User;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Integer> {
    Optional<User> getByUsername(String username);
    Optional<User> getUsersByEmail(String email);
}
