package com.sistemacontable.sistema_contable.ElectroAndes.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Proveedor;

@Repository
public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {

    // Spring deduce automáticamente: SELECT * FROM proveedores WHERE cuit_cuil = ?
    Proveedor findByCuitCuil(String cuitCuil);

    // Cambia la búsqueda por CUIT para que solo encuentre activos
    Proveedor findByCuitCuilAndActivoTrue(String cuitCuil);

    // Opcional: Para buscar un ID específico solo si no está borrado
    Optional<Proveedor> findByIdAndActivoTrue(Long id);

    // Método para buscar por familia (rubro) solo activos
    List<Proveedor> findAllByRubroIgnoreCaseAndActivoTrue(String rubro);

    // Método para buscar por estado (activo/inactivo)
    List<Proveedor> findAllByActivoTrue();

    List<Proveedor> findAllByActivoFalse();

    @Query("SELECT DISTINCT p.rubro FROM Proveedor p WHERE p.activo = true")
    List<String> findDistinctRubros();

    @Query("SELECT ap.proveedor FROM ArticuloProveedor ap "
            + "WHERE ap.articulo.id IN :articuloIds "
            + "GROUP BY ap.proveedor "
            + "HAVING COUNT(DISTINCT ap.articulo.id) = :totalArticulos")
    List<Proveedor> findProveedoresAptos(
            @Param("articuloIds") List<Long> articuloIds,
            @Param("totalArticulos") Long totalArticulos
    );
}
