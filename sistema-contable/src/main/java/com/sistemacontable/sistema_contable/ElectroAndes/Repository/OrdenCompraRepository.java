package com.sistemacontable.sistema_contable.ElectroAndes.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.OrdenCompra;

@Repository
public interface OrdenCompraRepository extends JpaRepository<OrdenCompra, Long> {

    Optional<OrdenCompra> findBySolicitudAsociadaNumeroSolicitud(String numeroOrden);
}
