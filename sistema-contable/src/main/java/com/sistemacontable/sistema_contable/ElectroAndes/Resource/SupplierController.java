// src/main/java/com.sistemacontable.sistema_contable.ElectroAndes.Resource/SupplierController.java
package com.sistemacontable.sistema_contable.ElectroAndes.Resource;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Supplier;
import com.sistemacontable.sistema_contable.ElectroAndes.Service.SupplierServiceImp;
import com.sistemacontable.sistema_contable.ElectroAndes.Util.SupplierMapper; // Importamos el Mapper
import com.sistemacontable.sistema_contable.dto.*; // Importamos los DTOs

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierServiceImp supplierService;
    private final SupplierMapper supplierMapper;

    // 1. Elimina los @Autowired de los campos.
    // 2. Define el constructor con TODAS las dependencias.
    // Spring inyectará automáticamente aquí (no se necesita @Autowired si solo hay un constructor).
    public SupplierController(SupplierServiceImp supplierService, SupplierMapper supplierMapper) {
        this.supplierService = supplierService;
        this.supplierMapper = supplierMapper;
    }

    // Constructor de inyección (aunque @Autowired se usa en campos, lo dejamos por consistencia)
    // public SupplierController(SupplierService supplierService) { this.supplierService = supplierService; }
    // ===================================================
    // 1. POST: /create-supplier
    // ===================================================
    @PostMapping("/create-supplier")
    public ResponseEntity<?> createSupplier(@Valid @RequestBody SupplierRequestDTO request) {
        try {
            // Llama al servicio, que devuelve la Entidad Supplier
            Supplier supplierCreado = supplierService.createSupplier(request);

            // El controlador TS devolvía un string simple, no la Entidad mapeada
            return ResponseEntity.status(HttpStatus.CREATED).body("Proveedor creado correctamente"); // 201 CREATED
        } catch (IllegalArgumentException e) {
            // Captura errores de unicidad/validación del Servicio (400 Bad Request)
            return ResponseEntity.badRequest().body("Error al crear el Proveedor: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno al crear el Proveedor: " + e.getMessage());
        }
    }

    // ===================================================
    // 2. POST: /edit-supplier
    // ===================================================
    @PostMapping("/edit-supplier")
    public ResponseEntity<?> editSupplier(@Valid @RequestBody SupplierEditRequestDTO request) {
        try {
            // Adaptar DTO de Edición (EditRequestDTO) a DTO de Request (SupplierRequestDTO)
            SupplierRequestDTO updateDto = new SupplierRequestDTO();
            updateDto.setName(request.getNewName());
            updateDto.setAddress(request.getNewAddress());
            updateDto.setPhone(request.getNewPhone());
            updateDto.setEmail(request.getNewEmail());

            // Llama al servicio, que devuelve la Entidad actualizada
            supplierService.editSupplier(request.getIdSupplier(), updateDto);

            return ResponseEntity.ok("Proveedor actualizado correctamente"); // 200 OK
        } catch (EntityNotFoundException e) {
            // Captura error 404
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error al editar: Proveedor no encontrado.");
        } catch (IllegalArgumentException e) {
            // Captura error 400 (Violación de unicidad)
            return ResponseEntity.badRequest().body("Error al editar el Proveedor: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno al editar el Proveedor: " + e.getMessage());
        }
    }

    // ===================================================
    // 3. POST: /delete-supplier (Eliminación Lógica)
    // ===================================================
    @PostMapping("/delete-supplier")
    public ResponseEntity<?> deleteSupplier(@Valid @RequestBody SupplierIdRequestDTO request) {
        try {
            supplierService.deleteSupplier(request.getIdSupplier());
            return ResponseEntity.ok("Proveedor eliminado correctamente"); // 200 OK
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error al eliminar: Proveedor no encontrado.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno al eliminar el Proveedor.");
        }
    }

    // ===================================================
    // 4. POST: /active-supplier
    // ===================================================
    @PostMapping("/active-supplier")
    public ResponseEntity<?> activeSupplier(@Valid @RequestBody SupplierIdRequestDTO request) {
        try {
            supplierService.activeSupplier(request.getIdSupplier());
            return ResponseEntity.ok("Proveedor activado correctamente"); // 200 OK
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error al activar: Proveedor no encontrado.");
        } catch (IllegalArgumentException e) {
            // Captura error 400 (El Proveedor no ha sido eliminado)
            return ResponseEntity.badRequest().body("Error al activar el Proveedor: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno al activar el Proveedor.");
        }
    }

    // ===================================================
    // 5. GET: /suppliers (Listar con paginación)
    // ===================================================
    @GetMapping
    public ResponseEntity<Page<SupplierResponseDTO>> getAllSuppliers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        // Llama al servicio, que devuelve Page<Supplier>
        Page<Supplier> supplierPage = supplierService.getAllSuppliers(page, limit);

        // Mapea la Entidad a DTO en el Resource, replicando la lógica de AsientoController
        Page<SupplierResponseDTO> dtosPage = supplierPage.map(supplierMapper::mapToDto);

        return ResponseEntity.ok(dtosPage);
    }

    // ===================================================
    // 6. GET: /suppliers/actives (Listar activos)
    // ===================================================
    @GetMapping("/actives")
    public ResponseEntity<Page<SupplierResponseDTO>> getAllSuppliersActive(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        Page<Supplier> supplierPage = supplierService.getAllSuppliersActive(page, limit);
        Page<SupplierResponseDTO> dtosPage = supplierPage.map(supplierMapper::mapToDto);

        return ResponseEntity.ok(dtosPage);
    }

    // ===================================================
    // 7. GET: /supplier/{idSupplier} (Detalle)
    // ===================================================
    @GetMapping("/{idSupplier}")
    public ResponseEntity<?> getSupplier(@PathVariable Long idSupplier) {
        try {
            // Llama al servicio, que devuelve la Entidad
            Supplier supplier = supplierService.getSupplierDetail(idSupplier);
            // Mapea la Entidad a DTO
            SupplierResponseDTO dto = supplierMapper.mapToDto(supplier);

            return ResponseEntity.ok(dto);
        } catch (EntityNotFoundException e) {
            // Captura error 404
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Proveedor no encontrado.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al obtener el Proveedor.");
        }
    }
}
