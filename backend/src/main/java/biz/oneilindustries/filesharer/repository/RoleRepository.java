package biz.oneilindustries.filesharer.repository;

import biz.oneilindustries.filesharer.entity.Role;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends CrudRepository<Role, Integer> {

}
