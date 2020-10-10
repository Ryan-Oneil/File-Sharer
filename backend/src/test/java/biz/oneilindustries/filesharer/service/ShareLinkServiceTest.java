package biz.oneilindustries.filesharer.service;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import biz.oneilindustries.filesharer.entity.Link;
import biz.oneilindustries.filesharer.entity.SharedFile;
import biz.oneilindustries.filesharer.entity.User;
import biz.oneilindustries.filesharer.repository.FileRepository;
import biz.oneilindustries.filesharer.repository.LinkRepository;
import biz.oneilindustries.filesharer.repository.LinkViewRepository;
import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

@SpringJUnitConfig
public class ShareLinkServiceTest {

    @MockBean
    private LinkRepository linkRepository;
    @MockBean
    private FileRepository fileRepository;
    @MockBean
    private LinkViewRepository viewRepository;
    private ShareLinkService service;

    private static final User testUser = new User("UnitTest", "test");
    private static List<File> testFiles;
    private static final File testDirectory = new File(String.format("F:/FileShare/%s", testUser.getUsername()));
    private static final SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");

    @BeforeEach
    public void setUp() throws IOException, ParseException {
        service = new ShareLinkService(linkRepository, fileRepository, viewRepository, "F:/FileShare/%s/links/");
        String testLocation = String.format("F:/FileShare/%s/links", testUser.getUsername());

        testFiles = new ArrayList<>();
        File parentDirectory = new File(testLocation + "/testLink/");
        File testFile = new File(testLocation + "/testLink/" + "testfile.txt");

        parentDirectory.mkdirs();
        testFile.createNewFile();

        testFiles.add(testFile);

        Link testLink = new Link("testLink", "testTitle", testUser, format.parse("2120-06-28T13:46:42Z"), new Date(), 0);
        List<SharedFile> sharedFiles = new ArrayList<>();

        SharedFile sharedFile = new SharedFile("testFile", testFile.getName(), testFile.length(), testLink);
        sharedFiles.add(sharedFile);
        testLink.setFiles(sharedFiles);

        Mockito.when(linkRepository.getById(testLink.getId())).thenReturn(Optional.of(testLink));
        Mockito.when(linkRepository.findById(testLink.getId())).thenReturn(Optional.of(testLink));
        Mockito.when(fileRepository.getById("testFile")).thenReturn(Optional.of(sharedFile));
    }

    @AfterAll
    public static void deleteSetup() {
        try {
            FileUtils.deleteDirectory(testDirectory);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void generateShareLinkTest() throws ParseException {
        String expires = "2020-06-28T13:46:42Z";
        String title = "UnitTestTitle";
        Date expectedExpiry = format.parse(expires);
        Link generatedLink = service.generateShareLink(testUser, expires, title, testFiles);

        assertThat(generatedLink.getCreator().getUsername()).isEqualTo(testUser.getUsername());
        assertThat(generatedLink.getTitle()).isEqualTo(title);
        assertThat(generatedLink.getExpiryDatetime().toString()).isEqualTo(expectedExpiry.toString());
    }

    @Test
    public void renameLinkDirectoryTest() {
        File file = testFiles.get(0);

        boolean renamedFolder = service.renameLinkDirectory(file, "renameTest", testUser.getUsername());
        File movedFile = new File(service.getFileLocation(testUser.getUsername(),"renameTest", file.getName()));

        assertThat(renamedFolder).isTrue();
        assertThat(movedFile.exists()).isTrue();
    }

    @Test
    public void generateSharedFilesTest() {
        Link testLink = new Link("testLink", "testTitle", testUser, new Date(), new Date(), 0);

        List<SharedFile> files = service.createSharedFiles(testFiles, testLink);

        assertThat(files.size()).isEqualTo(testFiles.size());
        assertThat(files.get(0).getLink().getId()).isEqualTo(testLink.getId());
    }

    @Test
    public void generateLinkUUIDTest() {
        int uuidSize = 16;
        String uuid = service.generateLinkUUID(uuidSize);

        assertThat(uuid.isEmpty()).isFalse();
        assertThat(uuid.length()).isEqualTo(uuidSize);
    }

    @Test
    public void generateFileUUIDTest() {
        int uuidSize = 16;
        String uuid = service.generateFileUUID(uuidSize);

        assertThat(uuid.isEmpty()).isFalse();
        assertThat(uuid.length()).isEqualTo(uuidSize);
    }

    @Test
    public void getLinkTest() {
        Optional<Link> testLink = service.getLink("testLink");

        assertThat(testLink.isPresent()).isTrue();
    }

    @Test
    public void getLinkCheckPresenceTest() {
        Link testLink = service.getLinkCheckPresence("testLink");

        assertThat(testLink).isNotNull();
    }

    @Test
    public void isExpiredTest() throws ParseException {
        Date testDate = format.parse("2040-06-28T13:46:42Z");
        boolean date1Expired = service.isExpired(testDate);

        testDate = format.parse("2000-06-28T13:46:42Z");
        boolean date2Expired = service.isExpired(testDate);

        assertThat(date1Expired).isFalse();
        assertThat(date2Expired).isTrue();
    }

    @Test
    public void getLinkFileWithValidationTest() {
        Link link = service.getLinkFileWithValidation("testLink");

        assertThat(link.getFiles()).isNotNull();
        assertThat(link.getFiles().size()).isEqualTo(testFiles.size());
    }

    @Test
    public void deleteLocalFile() {
        File testFile = testFiles.get(0);

        service.deleteLocalFile(testFile.getAbsolutePath());

        assertThat(testFile.exists()).isFalse();
    }
}
