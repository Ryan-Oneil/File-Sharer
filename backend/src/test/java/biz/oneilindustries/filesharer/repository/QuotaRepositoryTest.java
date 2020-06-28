package biz.oneilindustries.filesharer.repository;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import biz.oneilindustries.filesharer.entity.Quota;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@DataJpaTest
public class QuotaRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private QuotaRepository repository;

    @BeforeEach
    public void setupDatabase() {
        entityManager.clear();
        Quota quota = new Quota("test", 2500, 24, false);
        Quota quota2 = new Quota("test2", 36, 24, false);

        entityManager.persist(quota2);
        entityManager.persist(quota);
    }

    @Test
    public void getTotalUsedTest() {
        long totalUsed = repository.getTotalUsed();

        assertThat(totalUsed).isEqualTo(2536);
    }
}
