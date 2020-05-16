package biz.oneilindustries.filesharer.service;

import biz.oneilindustries.RandomIDGen;
import biz.oneilindustries.filesharer.filecreater.FileHandler;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.apache.tomcat.util.http.fileupload.FileItemIterator;
import org.apache.tomcat.util.http.fileupload.FileItemStream;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.apache.tomcat.util.http.fileupload.servlet.ServletFileUpload;
import org.springframework.stereotype.Service;

@Service
public class FileService {

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
        FileHandler.streamZip(folder, dest);
    }
}
