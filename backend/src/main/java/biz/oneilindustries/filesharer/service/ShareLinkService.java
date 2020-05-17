package biz.oneilindustries.filesharer.service;

import biz.oneilindustries.RandomIDGen;
import biz.oneilindustries.filesharer.entity.Link;
import biz.oneilindustries.filesharer.entity.SharedFile;
import biz.oneilindustries.filesharer.entity.User;
import biz.oneilindustries.filesharer.exception.LinkException;
import biz.oneilindustries.filesharer.exception.ResourceNotFoundException;
import biz.oneilindustries.filesharer.repository.FileRepository;
import biz.oneilindustries.filesharer.repository.LinkRepository;
import java.io.File;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ShareLinkService {

    private final LinkRepository linkRepository;
    private final FileRepository fileRepository;

    @Autowired
    public ShareLinkService(LinkRepository linkRepository, FileRepository fileRepository) {
        this.linkRepository = linkRepository;
        this.fileRepository = fileRepository;
    }

    public long shareFiles(List<File> files, Link link) {
        AtomicLong totalSize = new AtomicLong();

        files.forEach(file -> {
            fileRepository.save(new SharedFile(generateFileUUID(), file.getName(), file.length(), link));
            totalSize.addAndGet(file.length());
        });
        return totalSize.get();
    }

    public Link generateShareLink(User user, Date expires) {
        String id = generateLinkUUID();

        return new Link(id, user, expires);
    }

    public String generateLinkUUID() {
        String id = RandomIDGen.GetBase62(16);
        Optional<Link> link = getLink(id);

        while (link.isPresent()) {
            id = RandomIDGen.GetBase62(16);

            link = getLink(id);
        }
        return id;
    }

    public String generateFileUUID() {
        String id = RandomIDGen.GetBase62(16);
        Optional<SharedFile> file = getFile(id);

        while (file.isPresent()) {
            id = RandomIDGen.GetBase62(16);

            file = getFile(id);
        }
        return id;
    }

    public Optional<Link> getLink(String id) {
        return linkRepository.findById(id);
    }

    public Link checkLinkExists(String linkID) {
        Optional<Link> link = getLink(linkID);

        if (!link.isPresent()) throw new LinkException("This shared link doesn't exist");

        return link.get();
    }

    public void deleteLink(String linkID) {
        Link link = checkLinkExists(linkID);

        linkRepository.delete(link);
    }

    public void saveLink(Link link) {
        linkRepository.save(link);
    }

    public Optional<SharedFile> getFile(String id) {
        return fileRepository.findById(id);
    }

    public Optional<SharedFile> getFileWithLink(String id) {
        return fileRepository.getById(id);
    }

    public SharedFile checkFileExists(String name) {
        Optional<SharedFile> file = getFile(name);

        if (!file.isPresent()) throw new ResourceNotFoundException("Invalid File");

        return file.get();
    }

    public SharedFile checkFileWithLinkExists(String name) {
        Optional<SharedFile> file = getFileWithLink(name);

        if (!file.isPresent()) throw new ResourceNotFoundException("Invalid File");

        return file.get();
    }
}
