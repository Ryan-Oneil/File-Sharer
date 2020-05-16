package biz.oneilindustries.filesharer.repository;

import biz.oneilindustries.filesharer.entity.Link;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface  LinkRepository extends CrudRepository<Link, String> {
    Optional<Link> findById(String id);
}
