package biz.oneilindustries.filesharer.repository;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import biz.oneilindustries.filesharer.entity.User;
import biz.oneilindustries.filesharer.entity.VerificationToken;
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
public class VerificationTokenRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private VerificationTokenRepository repository;

    private User user;

    @Before
    public void setupDatabase() {
        entityManager.clear();
        user = new User("UnitTest", "test");
        VerificationToken token = new VerificationToken("awdqwe", user);

        entityManager.persist(user);
        entityManager.persist(token);
    }

    @Test
    public void findByTokenTest() {
        Optional<VerificationToken> token = repository.findByToken("awdqwe");

        assertThat(token.isPresent()).isTrue();
        assertThat(token.get().getToken()).isEqualTo("awdqwe");
    }

    @Test
    public void findByUsernameTest() {
        Optional<VerificationToken> token = repository.findByUsername(user);

        assertThat(token.isPresent()).isTrue();
        assertThat(token.get().getUsername().getUsername()).isEqualTo(user.getUsername());
    }
}
