package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import com.sistemacontable.sistema_contable.dto.CreateProveedorDto;
import com.sistemacontable.sistema_contable.dto.ResponseProveedorDto;

public interface ProveedorService {

    List<ResponseProveedorDto> findAll();

    Optional<ResponseProveedorDto> findById(Long id);

    ResponseProveedorDto findByCuit(String cuit);

    List<ResponseProveedorDto> findByFamilia(String familia);

    ResponseProveedorDto save(CreateProveedorDto dto);

    ResponseProveedorDto update(Long id, CreateProveedorDto dto);

    boolean delete(Long id);

    boolean activate(Long id);

    List<ResponseProveedorDto> findByStatus(boolean status);

    List<String> getRubrosDisponibles();

    void agregarArticuloAProveedor(Long providerId, Long articleId, BigDecimal precio);
}
