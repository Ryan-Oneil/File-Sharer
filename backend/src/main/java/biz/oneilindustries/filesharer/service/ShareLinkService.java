package biz.oneilindustries.filesharer.service;

import biz.oneilindustries.RandomIDGen;
import biz.oneilindustries.filesharer.entity.Link;
import biz.oneilindustries.filesharer.entity.SharedFile;
import biz.oneilindustries.filesharer.entity.User;
import biz.oneilindustries.filesharer.exception.LinkException;
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
            fileRepository.save(new SharedFile(file.getName(), file.length(), link));
            totalSize.addAndGet(file.length());
        });
        return totalSize.get();
    }

    public Link createShareLink(User user, Date expires) {
        String id = RandomIDGen.GetBase62(16);
        Optional<Link> link = getLink(id);

        while (link.isPresent()) {
            id = RandomIDGen.GetBase62(16);

            link = getLink(id);
        }
        Link newLink = new Link(id, user, expires);

        linkRepository.save(newLink);

        return newLink;
    }

    public Optional<Link> getLink(String id) {
        return linkRepository.findById(id);
    }

    public Link checkLinkExists(String linkID) {
        Optional<Link> link = getLink(linkID);

        if (!link.isPresent()) throw new LinkException("This shared link doesn't exist");

        return link.get();
    }
}
