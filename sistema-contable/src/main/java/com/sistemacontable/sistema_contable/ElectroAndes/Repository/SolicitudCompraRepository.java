package com.sistemacontable.sistema_contable.ElectroAndes.Repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.SolicitudCompra;

@Repository
public interface SolicitudCompraRepository extends JpaRepository<SolicitudCompra, Long> {
    Optional<SolicitudCompra> findByNumeroSolicitud(String numeroSolicitud);
}
