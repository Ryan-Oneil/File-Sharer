package biz.oneilindustries.filesharer.repository;

import biz.oneilindustries.filesharer.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Integer> {
    Optional<User> getByUsername(String username);
    Optional<User> getUsersByEmail(String email);
    @Query("select u from users u")
    List<User> getAllUsers(Pageable pageable);

    @Query("select count(u) from users u")
    int getUserCount();

    @Query("select case when count(u)> 0 then true else false end from users u where lower(u.username) like lower(?1)")
    boolean isUsernameTaken(String name);

    @Query("select case when count(u)> 0 then true else false end from users u where lower(u.email) like lower(?1)")
    boolean isEmailTaken(String email);
}
