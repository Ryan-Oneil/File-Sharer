package biz.oneilindustries.filesharer.filecreator;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import biz.oneilindustries.filesharer.filecreater.FileHandler;
import java.io.File;
import java.io.IOException;
import java.util.List;
import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
public class FileHandlerTest {

    private File testFile;
    private File testDirectory;

    @BeforeEach
    public void setup() throws IOException {
        testDirectory = new File("test/");
        testDirectory.mkdir();

        testFile = new File("test/test.txt");
        testFile.createNewFile();
    }

    @AfterEach
    public void cleanup() throws IOException {
        testFile.delete();
        FileUtils.deleteDirectory(testDirectory);
    }

    @Test
    public void getExtensionTypeTest() {
        String filename = "file.txt";

        String fileExtension = FileHandler.getExtensionType(filename);

        assertThat(fileExtension).isEqualTo("txt");
    }

    @Test
    public void renameFileTest() {
        File renamedFile = FileHandler.renameFile(testFile, "/");
        assertThat(renamedFile.getName()).isEqualTo("test(1).txt");

        renamedFile.delete();
    }

    @Test
    public void moveFilesToDirectoryTest() {
        File newDirectory = new File("test/movedFiles/");
        newDirectory.mkdir();

        List<File> files = List.of(testFile);
        FileHandler.moveFilesToDirectory(files, newDirectory.getAbsolutePath());

        assertThat(new File(newDirectory.getAbsolutePath() + "/test.txt").exists()).isTrue();
    }
}
