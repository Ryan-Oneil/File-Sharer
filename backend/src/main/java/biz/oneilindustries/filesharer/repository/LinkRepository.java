package biz.oneilindustries.filesharer.repository;

import biz.oneilindustries.filesharer.entity.Link;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface  LinkRepository extends CrudRepository<Link, String> {
    Optional<Link> findById(String id);

    @Query("select l from Link l where l.creator.username = :username ")
    List<Link> findByCreator(String username);
}
