package biz.oneilindustries.filesharer.repository;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import biz.oneilindustries.filesharer.entity.User;
import java.util.Optional;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository repository;

    @Before
    public void setupDatabase() {
        entityManager.clear();
        User user = new User("UnitTest", "test", true, "test@example.com");

        entityManager.persist(user);
    }

    @Test
    public void getByUsernameTest() {
        Optional<User> user = repository.getByUsername("UnitTest");

        assertThat(user.isPresent()).isTrue();
        assertThat(user.get().getUsername()).isEqualTo("UnitTest");
    }

    @Test
    public void getUsersByEmailTest() {
        Optional<User> user = repository.getUsersByEmail("test@example.com");

        assertThat(user.isPresent()).isTrue();
        assertThat(user.get().getEmail()).isEqualTo("test@example.com");
    }
}
