package com.sistemacontable.sistema_contable.ElectroAndes.Repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.Proveedor;

@Repository
public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {

    // Spring deduce automáticamente: SELECT * FROM proveedores WHERE cuit_cuil = ?
    Proveedor findByCuitCuil(String cuitCuil);

    // Cambia el findAll() por defecto por este:
    List<Proveedor> findAllByActivoTrue();

    // Cambia la búsqueda por CUIT para que solo encuentre activos
    Proveedor findByCuitCuilAndActivoTrue(String cuitCuil);

    // Opcional: Para buscar un ID específico solo si no está borrado
    Optional<Proveedor> findByIdAndActivoTrue(Long id);
}
