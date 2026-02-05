package com.sistemacontable.sistema_contable.ElectroAndes.Resource;

import com.sistemacontable.sistema_contable.dto.CreateProveedorDto;
import com.sistemacontable.sistema_contable.dto.ResponseProveedorDto;
import com.sistemacontable.sistema_contable.ElectroAndes.Service.ProveedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proveedores")
public class ProveedorController {

    @Autowired
    private ProveedorService proveedorService;

    // 1. OBTENER TODOS
    @GetMapping
    public List<ResponseProveedorDto> getAll() {
        return proveedorService.findAll();
    }

    // 2. OBTENER POR ID
    @GetMapping("/{id}")
    public ResponseEntity<ResponseProveedorDto> getById(@PathVariable Long id) {
        return proveedorService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. OBTENER POR CUIT/CUIL
    @GetMapping("/cuit/{cuit}")
    public ResponseEntity<ResponseProveedorDto> getByCuit(@PathVariable String cuit) {
        ResponseProveedorDto dto = proveedorService.findByCuit(cuit);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    // 4. CREAR NUEVO PROVEEDOR
    @PostMapping
    public ResponseEntity<ResponseProveedorDto> create(@RequestBody CreateProveedorDto createDto) {
        try {
            ResponseProveedorDto savedDto = proveedorService.save(createDto);
            return new ResponseEntity<>(savedDto, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // 5. ACTUALIZAR EXISTENTE
    @PutMapping("/{id}")
    public ResponseEntity<ResponseProveedorDto> update(@PathVariable Long id, @RequestBody CreateProveedorDto updateDto) {
        try {
            ResponseProveedorDto updatedDto = proveedorService.update(id, updateDto);
            return ResponseEntity.ok(updatedDto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 6. ELIMINAR
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (proveedorService.delete(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
