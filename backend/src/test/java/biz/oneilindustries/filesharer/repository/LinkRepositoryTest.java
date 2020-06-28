package biz.oneilindustries.filesharer.repository;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import biz.oneilindustries.filesharer.entity.Link;
import biz.oneilindustries.filesharer.entity.SharedFile;
import biz.oneilindustries.filesharer.entity.User;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
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
public class LinkRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private LinkRepository linkRepository;

    @BeforeEach
    public void setupDatabase() throws ParseException {
        entityManager.clear();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        User user = new User("UnitTest", "test");
        Link link = new Link("testLink", "test", user, new Date(), new Date(), 680);
        Link link2 = new Link("hrwq", "secondLink", user, format.parse("2040-12-12"), new Date(), 230);
        SharedFile file = new SharedFile("awd", "test.png", 230, link);
        SharedFile file2 = new SharedFile("dwa", "test2.png", 450, link);

        ArrayList<SharedFile> files = new ArrayList<>();
        files.add(file);
        files.add(file2);
        link.setFiles(files);

        link.setViews(35);

        entityManager.persist(user);
        entityManager.persist(link);
        entityManager.persist(link2);
        entityManager.persist(file);
        entityManager.persist(file2);
    }

    @Test
    public void findByIdTest() {
        Optional<Link> link = linkRepository.findById("testLink");

        assertThat(link.isPresent()).isTrue();
        assertThat(link.get().getId()).isEqualTo("testLink");
    }

    @Test
    public void getAllByCreatorTest() {
        List<Link> links = linkRepository.getAllByCreator("UnitTest");

        assertThat(links.size()).isEqualTo(2);
        assertThat(links.get(0).getCreator().getUsername()).isEqualTo("UnitTest");
    }

    @Test
    public void getByIdTest() {
        Optional<Link> link = linkRepository.getById("testLink");

        assertThat(link.isPresent()).isTrue();
        assertThat(link.get().getId()).isEqualTo("testLink");

        List<SharedFile> files = link.get().getFiles();

        assertThat(files.size()).isEqualTo(2);
    }

    @Test
    public void getAllExpiredByCreatorTest() {
        List<Link> links = linkRepository.getAllExpiredByCreator("UnitTest");

        assertThat(links.size()).isEqualTo(1);
        assertThat(links.get(0).getCreator().getUsername()).isEqualTo("UnitTest");
    }

    @Test
    public void getAllActiveByCreatorTest() {
        List<Link> links = linkRepository.getAllActiveByCreator("UnitTest");

        assertThat(links.size()).isEqualTo(1);
        assertThat(links.get(0).getCreator().getUsername()).isEqualTo("UnitTest");
    }

    @Test
    public void findTop5ByCreator_UsernameOrderByCreationDateDescTest() {
        List<Link> links = linkRepository.findTop5ByCreator_UsernameOrderByCreationDateDesc("UnitTest");

        Link link1 = links.get(0);
        Link link2 = links.get(1);

        assertThat(link1.getCreationDate().after(link2.getCreationDate())).isEqualTo(true);
        assertThat(link1.getCreator().getUsername()).isEqualTo("UnitTest");
    }

    @Test
    public void getTotalViewsTest() {
        long views = linkRepository.getTotalViews();

        assertThat(views).isEqualTo(35);
    }

    @Test
    public void getTotalLinksTest() {
        long totalLinkCount = linkRepository.getTotalLinks();

        assertThat(totalLinkCount).isEqualTo(2);
    }
}
