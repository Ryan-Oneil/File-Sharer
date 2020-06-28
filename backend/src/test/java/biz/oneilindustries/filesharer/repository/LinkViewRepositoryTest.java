package biz.oneilindustries.filesharer.repository;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import biz.oneilindustries.filesharer.entity.Link;
import biz.oneilindustries.filesharer.entity.LinkView;
import biz.oneilindustries.filesharer.entity.User;
import java.util.Date;
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
public class LinkViewRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private LinkViewRepository repository;

    private Link link;

    @BeforeEach
    public void setupDatabase() {
        entityManager.clear();
        User user = new User("UnitTest", "test");
        link = new Link("testLink", "test", user, new Date(), new Date(), 680);
        link.setViews(1);

        LinkView view = new LinkView("0.0.0.0", link);

        entityManager.persist(user);
        entityManager.persist(link);
        entityManager.persist(view);
    }

    @Test
    public void getFirstByIpAndLink() {
        Optional<LinkView> view = repository.getFirstByIpAndLink("0.0.0.0", link);

        assertThat(view.isPresent()).isTrue();
        assertThat(view.get().getIp()).isEqualTo("0.0.0.0");
    }
}
