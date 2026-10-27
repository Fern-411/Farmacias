package com.farmacias.auth.dao;

import com.farmacias.auth.model.AuditoriaEvento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuditoriaEventoDao extends JpaRepository<AuditoriaEvento, Long> {
    List<AuditoriaEvento> findTop50ByOrderByFechaHoraDesc();
    List<AuditoriaEvento> findByUsernameOrderByFechaHoraDesc(String username);
}
