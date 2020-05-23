package biz.oneilindustries.filesharer.repository;

import biz.oneilindustries.filesharer.entity.Link;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface  LinkRepository extends CrudRepository<Link, String> {
    Optional<Link> findById(String id);

    @Query("select l from Link l where l.creator.username = :username ")
    List<Link> getAllByCreator(String username);

    @EntityGraph(attributePaths  = {"files"})
    Optional<Link> getById(String id);

    @Query("select l from Link l where l.creator.username = :username and l.expiryDatetime < CURRENT_TIMESTAMP ")
    List<Link> getAllExpiredByCreator(String username);

    @Query("select l from Link l where l.creator.username = :username and l.expiryDatetime > CURRENT_TIMESTAMP ")
    List<Link> getAllActiveByCreator(String username);
}
