package biz.oneilindustries.filesharer.service;

import static biz.oneilindustries.filesharer.AppConfig.SHARED_LINK_DIRECTORY;

import biz.oneilindustries.RandomIDGen;
import biz.oneilindustries.filesharer.dto.FileDTO;
import biz.oneilindustries.filesharer.dto.LinkDTO;
import biz.oneilindustries.filesharer.entity.Link;
import biz.oneilindustries.filesharer.entity.SharedFile;
import biz.oneilindustries.filesharer.entity.User;
import biz.oneilindustries.filesharer.exception.LinkException;
import biz.oneilindustries.filesharer.exception.ResourceNotFoundException;
import biz.oneilindustries.filesharer.repository.FileRepository;
import biz.oneilindustries.filesharer.repository.LinkRepository;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.apache.commons.io.FileUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

@Service
public class ShareLinkService {

    private final LinkRepository linkRepository;
    private final FileRepository fileRepository;
    private static final Logger logger = LogManager.getLogger(ShareLinkService.class);
    private static final int UUID_LENGTH = 16;

    public ShareLinkService(LinkRepository linkRepository, FileRepository fileRepository) {
        this.linkRepository = linkRepository;
        this.fileRepository = fileRepository;
    }

    public Link generateShareLink(User user, String expires, String title, List<File> files) throws ParseException {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");

        long sizeOfFiles = files.stream().mapToLong(File::length).sum();
        Link link = new Link(generateLinkUUID(UUID_LENGTH), title, user, format.parse(expires), new Date(), sizeOfFiles);

        linkRepository.save(link);
        shareFiles(files, link);

        //Checks to see if the files parent directory matches the link id
        //If files are uploaded using rest API then it is first put into a temp folder
        if (!renameLinkDirectory(files.get(0), link)) {
            logger.error("Unable to rename directory " + files.get(0).getParent());
            throw new RuntimeException("Error changing directory name");
        }
        return link;
    }

    private boolean renameLinkDirectory(File file, Link link) {
        File parent = file.getParentFile();

        if (!parent.getName().equals(link.getId())) {
            File reNamedDirectory = new File(getLinkDirectory(link.getCreator().getUsername(), link.getId()));

            return parent.renameTo(reNamedDirectory);
        }
        return true;
    }

    public List<SharedFile> shareFiles(List<File> files, Link link) {
        List<SharedFile> sharedFiles = files.stream().map(file -> new SharedFile(generateFileUUID(UUID_LENGTH), file.getName(), file.length(), link))
            .collect(Collectors.toList());

        fileRepository.saveAll(sharedFiles);
        return sharedFiles;
    }

    public String generateLinkUUID(int length) {
        String id = RandomIDGen.GetBase62(length);
        Optional<Link> link = getLink(id);

        while (link.isPresent()) {
            id = RandomIDGen.GetBase62(length);

            link = getLink(id);
        }
        return id;
    }

    public String generateFileUUID(int length) {
        String id = RandomIDGen.GetBase62(length);
        Optional<SharedFile> file = getFile(id);

        while (file.isPresent()) {
            id = RandomIDGen.GetBase62(length);

            file = getFile(id);
        }
        return id;
    }

    public Optional<Link> getLink(String id) {
        return linkRepository.findById(id);
    }

    public Link getLinkCheckPresence(String linkID) {
        Optional<Link> link = getLink(linkID);

        if (!link.isPresent()) throw new LinkException("This shared link doesn't exist");

        return link.get();
    }

    public Link getLinkValidate(String linkID) {
        Link link = getLinkCheckPresence(linkID);

        checkLinkExpiry(link);

        return link;
    }

    public Link getLinkFileWithValidation(String linkID) {
        Optional<Link> link = linkRepository.getById(linkID);

        if (!link.isPresent()) throw new LinkException("This shared link doesn't exist");

        return link.get();
    }

    public void checkLinkExpiry(Link link) {
        if (isExpired(link.getExpiryDatetime())) throw new LinkException("This link has expired");
    }

    public boolean isExpired(Date date) {
        Calendar cal = Calendar.getInstance();
        return (date.getTime() - cal.getTime().getTime()) <= 0;
    }

    public Link deleteLink(String linkID) {
        Link link = getLinkFileWithValidation(linkID);
        User user = link.getCreator();

        link.getFiles().forEach(sharedFile -> {
            String fileLocation = getFileLocation(user.getUsername(), linkID, sharedFile.getName());

            deleteLocalFile(fileLocation);
        });
        deleteLocalFile(getLinkDirectory(user.getUsername(), linkID));

        linkRepository.delete(link);

        return link;
    }

    public void reduceLinkSize(Link link, long size) {
        link.setSize(link.getSize() - size);
        linkRepository.save(link);
    }

    public void increaseLinkSize(Link link, long size) {
        link.setSize(link.getSize() + size);
        linkRepository.save(link);
    }

    public void deleteFile(String fileID) {
        SharedFile file = checkFileLinkValidation(fileID);
        Link link = file.getLink();

        reduceLinkSize(link, file.getSize());

        String fileLocation = getFileLocation(link.getCreator().getUsername(), link.getId(), file.getName());

        deleteLocalFile(fileLocation);
        fileRepository.delete(file);
    }

    private void deleteLocalFile(String path) {
        try {
            Files.deleteIfExists(Paths.get(path));
        } catch (IOException e) {
            logger.error(e.getMessage());
        }
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

    public SharedFile checkFileLinkValidation(String name) {
        Optional<SharedFile> file = getFileWithLink(name);

        if (!file.isPresent()) throw new ResourceNotFoundException("Invalid File");
        checkLinkExpiry(file.get().getLink());

        return file.get();
    }

    public String getFileLocation(String user, String linkID, String fileName) {
        return String.format(SHARED_LINK_DIRECTORY + "%s/%s", user, linkID, fileName);
    }

    public String getLinkDirectory(String user, String linkID) {
        return String.format(SHARED_LINK_DIRECTORY + "%s", user, linkID);
    }

    public List<Link> getUserLinks(String user) {
        return linkRepository.getAllByCreator(user);
    }

    public List<Link> getExpiredUserLinks(String user) {
        return linkRepository.getAllExpiredByCreator(user);
    }

    public List<Link> getActiveUserLinks(String user) {
        return linkRepository.getAllActiveByCreator(user);
    }

    public Map<String, List<LinkDTO>> getUserLinksSplit(String user) {
        List<LinkDTO> activeLinks = linksToDTO(getActiveUserLinks(user));
        List<LinkDTO> expiredLinks = linksToDTO(getExpiredUserLinks(user));

        return Map.of("activeLinks", activeLinks, "expiredLinks", expiredLinks);
    }

    public List<FileDTO> addFilesToLink(String linkID, List<File> files) {
        Link link = getLinkValidate(linkID);

        long sizeOfFiles = files.stream().mapToLong(File::length).sum();
        List<SharedFile> sharedFiles = shareFiles(files, link);

        increaseLinkSize(link, sizeOfFiles);

        moveNewFilesToDirectory(files, getLinkDirectory(link.getCreator().getUsername(), link.getId()));

        return filesToDTO(sharedFiles);
    }

    private void moveNewFilesToDirectory(List<File> files, String dest) {
        File destFolder = new File(dest);
        File originalParent = files.get(0).getParentFile();

        files.forEach(file -> {
            try {
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

    public void editLink(String linkID, String title, String expires) throws ParseException {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
        Date date = format.parse(expires);

        Link link = getLinkValidate(linkID);

        link.setTitle(title);
        link.setExpiryDatetime(date);
        linkRepository.save(link);
    }

    public HashMap<String, Object> getUserStats(String user) {
        HashMap<String, Object> stats = new HashMap<>();
        List<LinkDTO> recentLinks = linksToDTO(linkRepository.findTop5ByCreator_UsernameOrderByCreationDateDesc(user));
        List<LinkDTO> mostViewedLinks = linksToDTO(linkRepository.findTop5ByCreator_UsernameOrderByViewsDesc(user));

        stats.put("totalLinks", linkRepository.getUserLinkCount(user));
        stats.put("totalViews", linkRepository.getUserLinkCount(user));
        stats.put("mostViewed", mostViewedLinks);
        stats.put("recentShared", recentLinks);

        return stats;
    }

    public List<LinkDTO> linksToDTO(List<Link> links) {
        return links.stream()
            .map(this::linkToDTO)
            .collect(Collectors.toList());
    }

    public LinkDTO linkToDTO(Link link) {
        return new LinkDTO(link.getTitle(), link.getId(), link.getExpiryDatetime(), link.getSize(), link.getViews());
    }

    public LinkDTO linkToDTO(Link link, List<FileDTO> files) {
        return new LinkDTO(link.getTitle(), link.getId(), link.getExpiryDatetime(), files, link.getSize(), link.getViews());
    }

    public FileDTO fileToDTO(SharedFile file) {
        return new FileDTO(file.getId(), file.getName(), file.getSize());
    }

    public List<FileDTO> filesToDTO(List<SharedFile> files) {
        return files.stream()
            .map(this::fileToDTO)
            .collect(Collectors.toList());
    }
}
