package com.sistemacontable.sistema_contable.ElectroAndes.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Proveedor;

@Repository
public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {

    // Spring deduce automáticamente: SELECT * FROM proveedores WHERE cuit_cuil = ?
    Proveedor findByCuitCuil(String cuitCuil);

    // Opcional: Para buscar proveedores por rubro en el futuro
    // List<Proveedor> findByRubro(String rubro);
}