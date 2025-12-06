package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import com.sistemacontable.sistema_contable.dto.CuentaDTO;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.Cuenta;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.TipoCuenta; 
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.CuentaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CuentaServiceImp implements CuentaService {

    @Autowired
    private CuentaRepository cuentaRepositorio;

    // Recupera todas las cuentas de la base de datos
    @Override
    public List<CuentaDTO> obtenerTodasLasCuentas() {
        return cuentaRepositorio.findAllByActivadoIsTrue()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // Busca una cuenta por su id
    @Override
    public CuentaDTO obtenerCuentaPorId(Long id) {
        Cuenta cuenta = cuentaRepositorio.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cuenta no encontrada"));
        return convertirADTO(cuenta);
    }

    // Crea una nueva cuenta en la base de datos usando los datos del DTO
    @Override
    public CuentaDTO crearCuenta(CuentaDTO dto) {
        Cuenta cuenta = new Cuenta();
        mapearDesdeDTO(dto, cuenta);
        cuenta = cuentaRepositorio.save(cuenta);
        return convertirADTO(cuenta);
    }

    // Actualiza una cuenta existente
    @Override
    public CuentaDTO actualizarCuenta(Long id, CuentaDTO dto) {
        Cuenta cuenta = cuentaRepositorio.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cuenta no encontrada"));
        mapearDesdeDTO(dto, cuenta);
        cuenta = cuentaRepositorio.save(cuenta);
        return convertirADTO(cuenta);
    }

    // Elimina una cuenta por su ID (Eliminación Lógica)
    @Override
    public void eliminarCuenta(Long id) {
        Cuenta cuenta = cuentaRepositorio.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cuenta no encontrada"));
        cuenta.setActivado(false);
        cuentaRepositorio.save(cuenta);
    }

    // Devuelve una lista en texto plano de las cuentas, con formato tipo árbol numerado
    @Override
    public List<String> obtenerCuentasJerarquicasNumeradas() {
        List<Cuenta> cuentasRaiz = cuentaRepositorio.findByCuentaPadreIsNull()
                .stream()
                .sorted(Comparator.comparing(Cuenta::getNombreCuenta))
                .collect(Collectors.toList());

        List<String> resultado = new ArrayList<>();
        int[] contador = {1};
        for (Cuenta cuenta : cuentasRaiz) {
            String prefijo = String.valueOf(contador[0]);
            construirJerarquia(cuenta, prefijo, 0, resultado);
            contador[0]++;
        }
        return resultado;
    }

    // Recursivo, arma la jerarquía en texto plano
    private void construirJerarquia(Cuenta cuenta, String numeracion, int nivel, List<String> resultado) {
        StringBuilder linea = new StringBuilder();

        for (int i = 0; i < nivel; i++) {
            linea.append("    ");
        }

        linea.append(numeracion).append(" - ").append(cuenta.getNombreCuenta())
                .append(" [ID: ").append(cuenta.getId()).append("]");
        resultado.add(linea.toString());

        List<Cuenta> hijos = cuentaRepositorio.findAll().stream()
                .filter(c -> c.getCuentaPadre() != null && Objects.equals(c.getCuentaPadre().getId(), cuenta.getId()))
                .sorted(Comparator.comparing(Cuenta::getNombreCuenta))
                .collect(Collectors.toList());

        int subcontador = 1;
        for (Cuenta hijo : hijos) {
            String subNumeracion = numeracion + "." + subcontador;
            construirJerarquia(hijo, subNumeracion, nivel + 1, resultado);
            subcontador++;
        }
    }

    // Convierte una entidad Cuenta a CuentaDTO (AGREGADO: Conversión del TipoCuenta a String)
    private CuentaDTO convertirADTO(Cuenta cuenta) {
        CuentaDTO dto = new CuentaDTO();
        dto.setId(cuenta.getId());
        dto.setNombreCuenta(cuenta.getNombreCuenta());
        dto.setActivado(cuenta.getActivado());
        dto.setEsHoja(cuenta.getEsHoja());
        
        // Mapear el TipoCuenta a String en el DTO de salida
        if (cuenta.getTipo() != null) {
            dto.setTipo(cuenta.getTipo().name());
        }

        if (cuenta.getCuentaPadre() != null) {
            dto.setCuentaPadreId(cuenta.getCuentaPadre().getId());
        }
        return dto;
    }

    // toma datos del DTO y los aplica sobre la entidad Cuenta para guardar en la base de datos
    private void mapearDesdeDTO(CuentaDTO dto, Cuenta cuenta) {
        cuenta.setNombreCuenta(dto.getNombreCuenta());
        cuenta.setActivado(dto.getActivado());
        cuenta.setEsHoja(dto.getEsHoja());
        
        // LÓGICA AGREGADA PARA MAPE AR Y VALIDAR 'TIPO'
        if (dto.getTipo() != null && !dto.getTipo().isEmpty()) {
            try {
                // Convierte el String (ej: "ACTIVO") al Enum (TipoCuenta.ACTIVO)
                cuenta.setTipo(TipoCuenta.valueOf(dto.getTipo().toUpperCase())); 
            } catch (IllegalArgumentException e) {
                // Si el valor no coincide con el Enum
                throw new IllegalArgumentException("Tipo de cuenta no válido: " + dto.getTipo() + ". Valores permitidos: ACTIVO, PASIVO, PATRIMONIO, INGRESO, EGRESO.");
            }
        } else {
            // Si el DTO no trae el campo (a pesar de ser obligatorio)
            throw new IllegalArgumentException("El campo 'tipo' es obligatorio y no puede estar vacío.");
        }
        
        // Lógica para el padre
        if (dto.getCuentaPadreId() != null) {
            Cuenta padre = cuentaRepositorio.findById(dto.getCuentaPadreId())
                    .orElseThrow(() -> new EntityNotFoundException("Cuenta padre no encontrada"));
            cuenta.setCuentaPadre(padre);
        } else {
            cuenta.setCuentaPadre(null);
        }
        
        // El campo 'saldo' tiene un valor por defecto de 0.0 en la Entity, 
        // por lo que no necesita ser mapeado a menos que se quiera permitir un saldo inicial distinto.
    }
}