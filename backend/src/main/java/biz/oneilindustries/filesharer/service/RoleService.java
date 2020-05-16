package biz.oneilindustries.filesharer.service;

import biz.oneilindustries.filesharer.repository.RoleRepository;
import biz.oneilindustries.filesharer.entity.Role;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    @Autowired
    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Transactional
    public Iterable<Role> getRoles() {
        return roleRepository.findAll();
    }
}
