package biz.oneilindustries.filesharer.repository;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import biz.oneilindustries.filesharer.AppConfig;
import biz.oneilindustries.filesharer.entity.Link;
import biz.oneilindustries.filesharer.entity.SharedFile;
import biz.oneilindustries.filesharer.entity.User;
import java.util.Date;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@DataJpaTest
@ContextConfiguration(classes = AppConfig.class)
public class FileRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private FileRepository fileRepository;

    @BeforeEach
    public void setupDatabase() {
        User user = new User("UnitTest", "test");
        Link link = new Link("testLink", "test", user, new Date(), new Date(), 230);
        SharedFile file = new SharedFile("awd", "test.png", 230, link);
        SharedFile file2 = new SharedFile("dwa", "test2.png", 450, link);

        entityManager.persist(user);
        entityManager.persist(link);
        entityManager.persist(file);
        entityManager.persist(file2);
    }

    @Test
    public void getByIDTest() {
        Optional<SharedFile> foundFile = fileRepository.getById("awd");

        assertThat(foundFile.isPresent()).isTrue();
        foundFile.ifPresent(sharedFile -> assertThat(sharedFile.getId()).isEqualTo("awd"));
    }

    @Test
    public void getTotalFileCountTest() {
        long count = fileRepository.getTotalFiles();

        assertThat(count).isEqualTo(2);
    }
}
