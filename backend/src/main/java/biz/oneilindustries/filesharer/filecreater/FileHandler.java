package biz.oneilindustries.filesharer.filecreater;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.io.FileUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

@Component
public class FileHandler {

    private static final Logger logger = LogManager.getLogger(FileHandler.class);

    private FileHandler() {
    }

    public static File writeFile(FileItemStream file, String fileName, String dest) throws IOException {
        File destFolder = new File(dest);

        if (!destFolder.exists()) {
            destFolder.mkdir();
        }
        File newFile = new File(dest + "/" + fileName);

        if (newFile.exists()) {
            newFile = renameFile(newFile, dest);
        }
        //Copy file to new file
        FileUtils.copyInputStreamToFile(file.openStream(), newFile);
        
        return newFile;
    }

    public static String getExtensionType(String originalFileName) {
        return originalFileName.substring(originalFileName.lastIndexOf('.')+1).toLowerCase();
    }

    public static File renameFile(File file, String dest) {
        int fileCount = 1;
        File currentFile = file;

        while (currentFile.exists()) {
            String fileName = file.getName().substring(0, file.getName().lastIndexOf('.')) + String.format("(%s)", fileCount);
            String fileExtension = "." + getExtensionType(file.getName());

            currentFile = new File(String.format("%s/%s", dest, fileName + fileExtension));
            fileCount++;
        }
        return currentFile;
    }

    public static void moveFilesToDirectory(List<File> files, String dest) {
        File destFolder = new File(dest);
        File originalParent = files.get(0).getParentFile();

        files.forEach(file -> {
            try {
                File newFile = new File(dest + "/" + file.getName());

                //Renames the original file
                if (newFile.exists()) {
                    String newFileName = FileHandler.renameFile(file, dest).getName();
                    File renamedFile = new File(originalParent.getAbsolutePath() + "/" + newFileName);
                    file.renameTo(renamedFile);
                    file = renamedFile;
                }
                FileUtils.moveFileToDirectory(file, destFolder, false);
            } catch (IOException e) {
                logger.error(e.getMessage());
            }
        });
        try {
            Files.deleteIfExists(originalParent.toPath());
        } catch (IOException e) {
            logger.error(e.getMessage());
        }
    }

    public static void deleteLocalFile(String path) {
        try {
            Files.deleteIfExists(Paths.get(path));
        } catch (IOException e) {
            logger.error(e.getMessage());
        }
    }

    public static void deleteDirectoryWithFiles(String path) {
        File directory = new File(path);

        try {
            FileUtils.deleteDirectory(directory);
        } catch (IOException e) {
            logger.error(e.getMessage());
        }
    }
}