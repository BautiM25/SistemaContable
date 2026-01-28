package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Proveedor;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.ProveedorRepository;
import com.sistemacontable.sistema_contable.dto.CreateProveedorDto;
import com.sistemacontable.sistema_contable.dto.ResponseProveedorDto;

@Service
public class ProveedorServiceImp implements ProveedorService {

    @Autowired
    private ProveedorRepository proveedorRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ResponseProveedorDto> findAll() {
        return proveedorRepository.findAll().stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ResponseProveedorDto> findById(Long id) {
        return proveedorRepository.findById(id).map(this::convertToResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseProveedorDto findByCuit(String cuit) {
        Proveedor proveedor = proveedorRepository.findByCuitCuil(cuit);
        return (proveedor != null) ? convertToResponseDto(proveedor) : null;
    }

    @Override
    @Transactional
    public ResponseProveedorDto save(CreateProveedorDto dto) {
        Proveedor proveedor = new Proveedor();
        mapDtoToEntity(dto, proveedor);
        Proveedor saved = proveedorRepository.save(proveedor);
        return convertToResponseDto(saved);
    }

    @Override
    @Transactional
    public ResponseProveedorDto update(Long id, CreateProveedorDto dto) {
        return proveedorRepository.findById(id).map(proveedor -> {
            mapDtoToEntity(dto, proveedor);
            return convertToResponseDto(proveedorRepository.save(proveedor));
        }).orElseThrow(() -> new RuntimeException("Proveedor no encontrado con id: " + id));
    }

    @Override
    @Transactional
    public boolean delete(Long id) {
        if (proveedorRepository.existsById(id)) {
            proveedorRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // --- MÉTODOS DE MAPEO ---
    private void mapDtoToEntity(CreateProveedorDto dto, Proveedor entity) {
        // General
        entity.setNombre(dto.getNombre());
        entity.setDireccion(dto.getDireccion());
        entity.setCuitCuil(dto.getCuitCuil());
        entity.setTelefono(dto.getTelefono());
        entity.setMail(dto.getMail());
        entity.setRubro(dto.getRubro());

        // Comercial
        entity.setDivisa(dto.getDivisa());
        entity.setSaldosAFavor(dto.getSaldosAFavor());
        entity.setSaldoInicialCC(dto.getSaldoInicialCC());
        entity.setSubcuenta(dto.getSubcuenta());
        entity.setCategoriaIva(dto.getCategoriaIva());

        // Banco
        entity.setIdentificadorBanco(dto.getIdentificadorBanco());
        entity.setPais(dto.getPais());
        entity.setBanco(dto.getBanco());

        // Especificas
        entity.setProducto(dto.getProducto());
        entity.setPrecio(dto.getPrecio());
        entity.setDescuento(dto.getDescuento());
    }

    private ResponseProveedorDto convertToResponseDto(Proveedor entity) {
        ResponseProveedorDto dto = new ResponseProveedorDto();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setCuitCuil(entity.getCuitCuil());
        dto.setMail(entity.getMail());
        dto.setRubro(entity.getRubro());
        dto.setCategoriaIva(entity.getCategoriaIva());
        dto.setDivisa(entity.getDivisa());
        dto.setSaldoInicialCC(entity.getSaldoInicialCC());
        dto.setBanco(entity.getBanco());
        return dto;
    }
}
