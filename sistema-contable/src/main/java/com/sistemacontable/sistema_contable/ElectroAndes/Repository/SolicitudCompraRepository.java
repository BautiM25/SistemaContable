// src/main/java/com/sistemacontable/sistema_contable/ElectroAndes/Repository/SolicitudCompraRepository.java
package com.sistemacontable.sistema_contable.ElectroAndes.Repository;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.SolicitudCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SolicitudCompraRepository extends JpaRepository<SolicitudCompra, Long> {
    
    // Método para buscar por el número de solicitud (para validación de unicidad)
    Optional<SolicitudCompra> findByNumeroSolicitud(String numeroSolicitud);

    // Método para listar por estado
    // List<SolicitudCompra> findByEstado(String estado); 
}