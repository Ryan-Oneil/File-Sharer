package biz.oneilindustries.filesharer.repository;

import biz.oneilindustries.filesharer.entity.SharedFile;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileRepository extends CrudRepository<SharedFile, String> {

    @EntityGraph(attributePaths  = {"link"})
    Optional<SharedFile> getById(String id);

    @Query("select count (f) from SharedFile f")
    long getTotalFiles();
}
