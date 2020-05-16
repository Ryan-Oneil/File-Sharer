package biz.oneilindustries.filesharer.repository;

import biz.oneilindustries.filesharer.entity.Quota;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuotaRepository extends CrudRepository<Quota, String> {

}
