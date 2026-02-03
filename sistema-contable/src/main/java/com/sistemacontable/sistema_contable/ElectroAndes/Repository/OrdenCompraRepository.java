package com.sistemacontable.sistema_contable.ElectroAndes.Repository;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.OrdenCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OrdenCompraRepository extends JpaRepository<OrdenCompra, Long> {

    Optional<OrdenCompra> findByNumeroOrdenCompra(String numeroOrdenCompra);

    Optional<OrdenCompra> findBySolicitudAsociadaNumeroSolicitud(String numeroSolicitud);
    
    boolean existsBySolicitudAsociadaId(Long idSolicitud);
}