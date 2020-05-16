package biz.oneilindustries.filesharer.repository;

import biz.oneilindustries.filesharer.entity.SharedFile;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileRepository extends CrudRepository<SharedFile, Integer> {

}
