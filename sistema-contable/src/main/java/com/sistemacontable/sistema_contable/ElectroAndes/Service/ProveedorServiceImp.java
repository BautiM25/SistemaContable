package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Article;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.ArticuloProveedor;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.Proveedor;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.ArticleRepository;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.ProveedorRepository;
import com.sistemacontable.sistema_contable.dto.ArticuloVinculadoDto;
import com.sistemacontable.sistema_contable.dto.CreateProveedorDto;
import com.sistemacontable.sistema_contable.dto.ResponseProveedorDto;

@Service
public class ProveedorServiceImp implements ProveedorService {

    @Autowired
    private ProveedorRepository proveedorRepository;

    @Autowired
    private ArticleRepository articleRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ResponseProveedorDto> findAll() {
        // Usamos el nuevo método que filtra los activos
        return proveedorRepository.findAllByActivoTrue().stream()
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
        // Usamos el método que verifica que esté activo
        Proveedor proveedor = proveedorRepository.findByCuitCuilAndActivoTrue(cuit);
        return (proveedor != null) ? convertToResponseDto(proveedor) : null;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResponseProveedorDto> findByFamilia(String familia) {
        return proveedorRepository.findAllByRubroIgnoreCaseAndActivoTrue(familia).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
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
        return proveedorRepository.findById(id).map(proveedor -> {
            proveedor.setActivo(false); // <--- Cambiamos el estado
            proveedorRepository.save(proveedor); // <--- Persistimos el cambio
            return true;
        }).orElse(false);
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
        entity.setSaldoInicialCC(dto.getSaldoInicialCC());
        entity.setSaldosAFavor(dto.getSaldoInicialCC());
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
        dto.setIdentificadorBanco(entity.getIdentificadorBanco());

        if (entity.getArticulosSuministrados() != null) {
            dto.setArticulos(entity.getArticulosSuministrados().stream()
                    .map(ap -> {
                        ArticuloVinculadoDto aDto = new ArticuloVinculadoDto();
                        aDto.setIdArticulo(ap.getArticulo().getId());
                        aDto.setReferencia(ap.getArticulo().getReferencia());
                        aDto.setDescripcion(ap.getArticulo().getDescripcion());
                        aDto.setPrecioPactado(ap.getPrecio());
                        return aDto;
                    }).collect(Collectors.toList()));
        }
        return dto;
    }

    @Override
    @Transactional
    public boolean activate(Long id) {
        return proveedorRepository.findById(id).map(proveedor -> {
            proveedor.setActivo(true); // Activamos el proveedor
            proveedorRepository.save(proveedor); // Persistimos el cambio
            return true;
        }).orElse(false);
    }

    @Override
    public List<ResponseProveedorDto> findByStatus(boolean status) {
        if (status) {
            return proveedorRepository.findAllByActivoTrue().stream()
                    .map(this::convertToResponseDto)
                    .collect(Collectors.toList());
        } else {
            return proveedorRepository.findAllByActivoFalse().stream()
                    .map(this::convertToResponseDto)
                    .collect(Collectors.toList());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getRubrosDisponibles() {
        return proveedorRepository.findDistinctRubros();
    }

    @Override
    @Transactional
    public void agregarArticuloAProveedor(Long idProveedor, Long idArticulo) {
        // Corregido: usando proveedorRepository y articleRepository (necesitás inyectar articleRepository acá)
        Proveedor proveedor = proveedorRepository.findById(idProveedor)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));

        // Necesitás inyectar articleRepository en este Service también
        Article articulo = articleRepository.findById(idArticulo)
                .orElseThrow(() -> new RuntimeException("Artículo no encontrado"));

        ArticuloProveedor asociacion = new ArticuloProveedor();
        asociacion.setProveedor(proveedor);
        asociacion.setArticulo(articulo);
        asociacion.setPrecio(articulo.getCostoBase());

        proveedor.getArticulosSuministrados().add(asociacion);
        proveedorRepository.save(proveedor);
    }
}
