// src/main/java/com.sistemacontable.sistema_contable.ElectroAndes.Service/SupplierServiceImp.java
package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Supplier;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.SupplierRepository;
import com.sistemacontable.sistema_contable.dto.SupplierRequestDTO;

import jakarta.persistence.EntityNotFoundException;

@Service
public class SupplierServiceImp {

    // Se asume inyección con @Autowired, siguiendo el patrón de AsientoServiceImp
    @Autowired
    private SupplierRepository supplierRepository;

    // ===================================================
    // 1. CREAR PROVEEDOR (static createSupplier)
    // Devuelve la Entidad para mapear en el Resource
    // ===================================================
    @Transactional
    public Supplier createSupplier(SupplierRequestDTO dto) {

        // Validación de unicidad: Email (replicando la lógica de error 400 del TS)
        if (supplierRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("El Proveedor ya existe");
        }

        // Validación de unicidad: Teléfono
        if (supplierRepository.findByPhone(dto.getPhone()).isPresent()) {
            throw new IllegalArgumentException("Ya existe un Proveedor con ese numero de telefono");
        }

        // Creación y guardado
        Supplier newSupplier = new Supplier();
        newSupplier.setName(dto.getName());
        newSupplier.setAddress(dto.getAddress());
        newSupplier.setPhone(dto.getPhone());
        newSupplier.setEmail(dto.getEmail());
        newSupplier.setActive(true);

        return supplierRepository.save(newSupplier);
    }

    // ===================================================
    // 2. EDITAR PROVEEDOR (static editSupplier)
    // Devuelve la Entidad para mapear en el Resource
    // ===================================================
    @Transactional
    public Supplier editSupplier(Long idSupplier, SupplierRequestDTO dto) {

        // 1. Buscar Proveedor (await Supplier.findById(idSupplier))
        Supplier supplier = supplierRepository.findById(idSupplier)
                .orElseThrow(() -> new EntityNotFoundException("El Proveedor no existe")); // Error 404

        // 2. Validación de unicidad para Email (si cambia)
        if (!supplier.getEmail().equalsIgnoreCase(dto.getEmail())) {
            if (supplierRepository.findByEmail(dto.getEmail()).isPresent()) {
                throw new IllegalArgumentException("El nuevo email ya pertenece a otro proveedor"); // Error 400
            }
        }

        // 3. Validación de unicidad para Teléfono (si cambia)
        if (!supplier.getPhone().equals(dto.getPhone())) {
            if (supplierRepository.findByPhone(dto.getPhone()).isPresent()) {
                throw new IllegalArgumentException("El nuevo teléfono ya pertenece a otro proveedor"); // Error 400
            }
        }

        // 4. Actualizar campos
        supplier.setName(dto.getName());
        supplier.setAddress(dto.getAddress());
        supplier.setPhone(dto.getPhone());
        supplier.setEmail(dto.getEmail());

        return supplierRepository.save(supplier);
    }

    // ===================================================
    // 3. LISTAR TODOS (static getAllSuppliers)
    // Devuelve Page<Supplier>
    // ===================================================
    @Transactional(readOnly = true)
    public Page<Supplier> getAllSuppliers(int page, int limit) {
        // Conversión de paginación de 1-base a 0-base (Pageable)
        Pageable pageable = PageRequest.of(page > 0 ? page - 1 : 0, limit);

        return supplierRepository.findAll(pageable);
    }

    // ===================================================
    // 4. LISTAR ACTIVOS (static getAllSuppliersActive)
    // Devuelve Page<Supplier> (asume findByActiveTrue en el Repositorio)
    // ===================================================
    @Transactional(readOnly = true)
    public Page<Supplier> getAllSuppliersActive(int page, int limit) {
        Pageable pageable = PageRequest.of(page > 0 ? page - 1 : 0, limit);

        // Se requiere el método en el Repositorio: findByActiveTrue(Pageable)
        return supplierRepository.findByActiveTrue(pageable);
    }

    // ===================================================
    // 5. OBTENER DETALLE (static getSupplier)
    // Devuelve la Entidad
    // ===================================================
    @Transactional(readOnly = true)
    public Supplier getSupplierDetail(Long idSupplier) {

        return supplierRepository.findById(idSupplier)
                .orElseThrow(() -> new EntityNotFoundException("La categoria no fue encontrada")); // Error 404
    }

    // ===================================================
    // 6. ELIMINACIÓN LÓGICA (static deleteSupplier)
    // ===================================================
    @Transactional
    public void deleteSupplier(Long idSupplier) {

        Supplier supplier = supplierRepository.findById(idSupplier)
                .orElseThrow(() -> new EntityNotFoundException("El Proveedor no fue encontrado")); // Error 404

        supplier.setActive(false);
        supplierRepository.save(supplier);
    }

    // ===================================================
    // 7. ACTIVACIÓN LÓGICA (static activeSupplier)
    // ===================================================
    @Transactional
    public void activeSupplier(Long idSupplier) {

        Supplier supplier = supplierRepository.findById(idSupplier)
                .orElseThrow(() -> new EntityNotFoundException("El Proveedor no fue encontrado")); // Error 404

        if (supplier.isActive()) {
            throw new IllegalArgumentException("El Proveedor no ha sido eliminado"); // Error 400
        }

        supplier.setActive(true);
        supplierRepository.save(supplier);
    }

    // Nota: Se omitió la función getSuppliersForArticles por requerir modelos no adaptados (Article, ArticleSupplier)
}
