package biz.oneilindustries.filesharer.repository;

import biz.oneilindustries.filesharer.entity.Link;
import biz.oneilindustries.filesharer.entity.LinkView;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;

public interface LinkViewRepository extends CrudRepository<LinkView, Integer> {
    Optional<LinkView> getFirstByIpAndLink(String ip, Link link);
}
