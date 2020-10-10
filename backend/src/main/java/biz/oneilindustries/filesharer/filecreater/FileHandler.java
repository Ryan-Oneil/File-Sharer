package biz.oneilindustries.filesharer.filecreater;

import java.io.File;
import java.io.IOException;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Component;

@Component
public class FileHandler {

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
}