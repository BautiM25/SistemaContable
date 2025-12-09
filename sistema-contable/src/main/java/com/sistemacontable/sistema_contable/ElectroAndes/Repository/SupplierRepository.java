package com.sistemacontable.sistema_contable.ElectroAndes.Repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Supplier;

// JpaRepository<TipoDeEntidad, TipoDelCampoId>
public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    // Mapeo directo de la consulta de existencia de Mongoose:
    Optional<Supplier> findByEmail(String email);

    // Es buena práctica agregar consultas para los campos únicos, como el teléfono
    Optional<Supplier> findByPhone(String phone);

    // Método necesario para listar solo proveedores activos con paginación
    Page<Supplier> findByActiveTrue(Pageable pageable);

}
