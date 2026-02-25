package com.sistemacontable.sistema_contable.ElectroAndes.Resource;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sistemacontable.sistema_contable.ElectroAndes.Service.ProveedorService;
import com.sistemacontable.sistema_contable.dto.CreateProveedorDto;
import com.sistemacontable.sistema_contable.dto.ResponseProveedorDto;

@RestController
@RequestMapping("/api/proveedores")
@CrossOrigin(origins = "*")
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

    @PutMapping("/activate/{id}")
    public ResponseEntity<Void> activate(@PathVariable Long id) {
        if (proveedorService.activate(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/status")
    public List<ResponseProveedorDto> getByStatus(@RequestParam boolean status) {
        return proveedorService.findByStatus(status);
    }

}
