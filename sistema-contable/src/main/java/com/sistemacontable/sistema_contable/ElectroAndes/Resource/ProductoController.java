package com.sistemacontable.sistema_contable.ElectroAndes.Resource;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Producto;
import com.sistemacontable.sistema_contable.ElectroAndes.Service.ProductoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*") // Opcional: permite llamadas desde cualquier frontend
public class ProductoController {

    private final ProductoService service;

    public ProductoController(ProductoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Producto> listar() {
        return service.obtenerTodos();
    }

//    @GetMapping("/stock-bajo")
//    public List<Producto> stockBajo() {
//        return service.obtenerConStockBajo();
//    }

    @GetMapping("/{id}")
    public Producto buscar(@PathVariable int id) {
        return service.buscarPorId(id).orElse(null);
    }

    @PostMapping
    public Producto guardar(@RequestBody Producto producto) {
        return service.guardar(producto);
    }

//    @PutMapping("/{id}/actualizar-stock")
//    public void actualizarStock(@PathVariable int id, @RequestParam int cantidad) {
//        service.actualizarStock(id, cantidad);
//    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable int id) {
        service.eliminar(id);
    }
}