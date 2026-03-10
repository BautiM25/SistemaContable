package com.sistemacontable.sistema_contable.ElectroAndes.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.CuentaCorriente;

@Repository
public interface CuentaCorrienteRepository extends JpaRepository<CuentaCorriente, Long> {

    // Busca la cuenta corriente usando el ID del proveedor asociado
    Optional<CuentaCorriente> findByProveedorId(Long idProveedor);
}
