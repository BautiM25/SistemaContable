package com.sistemacontable.sistema_contable.ElectroAndes.Resource;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sistemacontable.sistema_contable.ElectroAndes.Service.CuentaService;
import com.sistemacontable.sistema_contable.dto.CuentaDTO;

@RestController
@RequestMapping("/api/cuentas")
@CrossOrigin(origins = "http://localhost:5173") // esto me dice que es para el origen de frontend, no entendi pero lo dejo
public class CuentaController {

    private final CuentaService cuentaServicio;

    @Autowired
    public CuentaController(CuentaService cuentaServicio) {
        this.cuentaServicio = cuentaServicio;
    }

    // GET: Listar todas las cuentas
    @GetMapping
    public ResponseEntity<List<CuentaDTO>> listarTodas() {
        return ResponseEntity.ok(cuentaServicio.obtenerTodasLasCuentas());
    }

    // GET: Obtener una cuenta por ID
    @GetMapping("/{id}")
    public ResponseEntity<CuentaDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(cuentaServicio.obtenerCuentaPorId(id));
    }

    // POST: Crear una nueva cuenta
    @PostMapping("/create")
    public ResponseEntity<CuentaDTO> crear(@RequestBody CuentaDTO dto) {
        CuentaDTO nuevaCuenta = cuentaServicio.crearCuenta(dto);
        return ResponseEntity.ok(nuevaCuenta);
    }

    // PUT: Actualizar una cuenta existente
    @PutMapping("/{id}")
    public ResponseEntity<CuentaDTO> actualizar(@PathVariable Long id, @RequestBody CuentaDTO dto) {
        CuentaDTO actualizada = cuentaServicio.actualizarCuenta(id, dto);
        return ResponseEntity.ok(actualizada);
    }

    // DELETE: Eliminar una cuenta
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        cuentaServicio.eliminarCuenta(id);
        return ResponseEntity.noContent().build();
    }

    // GET: Ver jerarquía de cuentas en formato indentado y numerado
    @GetMapping("/jerarquia")
    public ResponseEntity<List<String>> obtenerJerarquiaNumerada() {
        List<String> jerarquia = cuentaServicio.obtenerCuentasJerarquicasNumeradas();
        return ResponseEntity.ok(jerarquia);
    }
}
