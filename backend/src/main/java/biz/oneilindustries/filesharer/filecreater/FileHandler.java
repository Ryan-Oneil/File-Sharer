package biz.oneilindustries.filesharer.filecreater;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import javax.imageio.ImageIO;
import org.apache.commons.io.FileUtils;
import org.apache.tomcat.util.http.fileupload.FileItemStream;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;

@Component
public class FileHandler {

    private static List<String> supportImageFormats;

    static {
        supportImageFormats = Arrays.asList(ImageIO.getWriterFormatNames());
    }

    private FileHandler() {
    }

    public static File writeFile(FileItemStream file, String fileName, String dest) throws IOException {
        String extension = getExtensionType(fileName);
        File destFolder = new File(dest);

        if (!destFolder.exists()) {
            destFolder.mkdir();
        }
        File newFile = new File(dest + "/" + fileName);

        //Copy file to new file
        FileUtils.copyInputStreamToFile(file.openStream(), newFile);
        
        return newFile;
    }

    public static String getExtensionType(String originalFileName) {
        return originalFileName.substring(originalFileName.lastIndexOf('.')+1).toLowerCase();
    }

    public static String getContentType(String originalFileName) {
        String extensionType = getExtensionType(originalFileName);

        if (extensionType.equalsIgnoreCase("jpg") || extensionType.equalsIgnoreCase("jpeg")) return "jpeg";

        return extensionType;
    }

    public static boolean isImageFile(String extension) {

        if (extension.contains(".")) extension = getExtensionType(extension);

        return supportImageFormats.contains(extension);
    }

    public static boolean isVideoFile(String contentType) {
        return contentType.startsWith("video");
    }

    public static void streamZip(String folderLocation, OutputStream zipDest) throws IOException {
        try (ZipOutputStream zs = new ZipOutputStream(zipDest)) {
            Path pp = Paths.get(folderLocation);
            Files.walk(pp)
                .filter(path -> !Files.isDirectory(path))
                .forEach(path -> {
                    FileSystemResource resource = new FileSystemResource(path);
                    ZipEntry zipEntry = new ZipEntry(pp.relativize(path).toString());
                    try {
                        zs.putNextEntry(zipEntry);
                        StreamUtils.copy(resource.getInputStream(), zs);
                        zs.closeEntry();
                    } catch (IOException ignored) {
                    }
                });
        }
    }
}