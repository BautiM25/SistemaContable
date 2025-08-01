package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Producto;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    private final ProductoRepository repo;

    public ProductoService(ProductoRepository repo) {
        this.repo = repo;
    }

    public List<Producto> obtenerTodos() {
        return repo.findByActivoTrueOrderByNombreAsc();
    }

//    public List<Producto> obtenerConStockBajo() {
//        return repo.findByStockActualLessThanEqualAndActivoTrueOrderByNombreAsc();
//    }

    public Optional<Producto> buscarPorId(int id) {
        return repo.findById(id);
    }

    public Producto guardar(Producto producto) {
        return repo.save(producto);
    }

//    public boolean actualizarStock(int idProducto, int cantidad) {
//        Optional<Producto> opt = repo.findById(idProducto);
//        if (opt.isPresent()) {
//            Producto p = opt.get();
//            p.setStockActual(p.getStockActual() + cantidad);
//            repo.save(p);
//            return true;
//        }
//        return false;
//    }

    public void eliminar(int id) {
        repo.deleteById(id);
    }
} 