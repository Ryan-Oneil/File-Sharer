package biz.oneilindustries.filesharer.repository;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import biz.oneilindustries.filesharer.entity.PasswordResetToken;
import biz.oneilindustries.filesharer.entity.User;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@DataJpaTest
public class ResetPasswordTokenRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ResetPasswordTokenRepository repository;

    private User user;

    @BeforeEach
    public void setupDatabase() {
        entityManager.clear();
        user = new User("UnitTest", "test");
        PasswordResetToken token = new PasswordResetToken("wadegf23", user);

        entityManager.persist(user);
        entityManager.persist(token);
    }

    @Test
    public void getByTokenTest() {
        Optional<PasswordResetToken> token = repository.getByToken("wadegf23");

        assertThat(token.isPresent()).isTrue();
        assertThat(token.get().getToken()).isEqualTo("wadegf23");
    }

    @Test
    public void getByUsernameTest() {
        Optional<PasswordResetToken> token = repository.getByUsername(user);

        assertThat(token.isPresent()).isTrue();
        assertThat(token.get().getUsername().getUsername()).isEqualTo(user.getUsername());
    }
}
