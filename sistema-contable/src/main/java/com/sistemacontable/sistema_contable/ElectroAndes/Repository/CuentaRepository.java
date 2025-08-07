package com.sistemacontable.sistema_contable.ElectroAndes.Repository;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Cuenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CuentaRepository extends JpaRepository<Cuenta, Long> {
    List<Cuenta> findByCuentaPadreIsNull(); // Cuentas raíz
    List<Cuenta> findAllByActivadoIsTrue();
}
