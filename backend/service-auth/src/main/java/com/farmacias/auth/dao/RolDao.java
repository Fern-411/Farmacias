package com.farmacias.auth.dao;

import com.farmacias.auth.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RolDao extends JpaRepository<Rol, Long> {
    Optional<Rol> findByCodigo(String codigo);
}
