package biz.oneilindustries.filesharer.service;

import biz.oneilindustries.RandomIDGen;
import biz.oneilindustries.filesharer.exception.ResourceNotFoundException;
import biz.oneilindustries.filesharer.filecreater.FileHandler;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import javax.servlet.http.HttpServletRequest;
import org.apache.tomcat.util.http.fileupload.FileItemIterator;
import org.apache.tomcat.util.http.fileupload.FileItemStream;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.apache.tomcat.util.http.fileupload.servlet.ServletFileUpload;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

@Service
public class SystemFileService {

    public List<File> handleFileUpload(HttpServletRequest request, long uploadLimit, String destination) throws IOException, FileUploadException {
        ArrayList<File> uploadedFiles = new ArrayList<>();

        ServletFileUpload upload = new ServletFileUpload();
        upload.setSizeMax(uploadLimit);

        FileItemIterator iterator;
        //Gets the uploaded file from request
        try {
            iterator = upload.getItemIterator(request);
        } catch (IOException e) {
            throw new RuntimeException("No file uploaded");
        }
        while(iterator.hasNext()) {
            FileItemStream item = iterator.next();

            if (item.isFormField()) continue;

            String fileName = RandomIDGen.GetBase62(16) + "." + FileHandler.getExtensionType(item.getName());

            File file = FileHandler.writeFile(item, fileName,  destination);
            uploadedFiles.add(file);
        }
        return uploadedFiles;
    }

    public void streamFolderAsZip(String folder, OutputStream dest) throws IOException {
        try (ZipOutputStream zs = new ZipOutputStream(dest)) {
            Path pp = Paths.get(folder);
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

    public StreamingResponseBody streamFile(String fileLocation) {
        File fileToStream = new File(fileLocation);

        if (!fileToStream.exists()) {
            throw new ResourceNotFoundException("File not found");
        }
        return out -> Files.copy(fileToStream.toPath(), out);
    }
}
