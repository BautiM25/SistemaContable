package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Proveedor;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.ProveedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProveedorService {

    @Autowired
    private ProveedorRepository proveedorRepository;

    public List<Proveedor> listarTodos() {
        return proveedorRepository.findAll();
    }

    public Optional<Proveedor> buscarPorId(Long id) {
        return proveedorRepository.findById(id);
    }

    public Proveedor guardar(Proveedor proveedor) {
        return proveedorRepository.save(proveedor);
    }

    public Proveedor actualizar(Long id, Proveedor proveedorActualizado) {
        return proveedorRepository.findById(id).map(p -> {
            p.setRazonSocial(proveedorActualizado.getRazonSocial());
            p.setCuit(proveedorActualizado.getCuit());
            p.setTelefono1(proveedorActualizado.getTelefono1());
            p.setTelefono2(proveedorActualizado.getTelefono2());
            p.setEmail(proveedorActualizado.getEmail());
            p.setDireccion(proveedorActualizado.getDireccion());
            p.setCiudad(proveedorActualizado.getCiudad());
            p.setProvincia(proveedorActualizado.getProvincia());
            p.setPais(proveedorActualizado.getPais());
            p.setRubro(proveedorActualizado.getRubro());
            p.setComentario(proveedorActualizado.getComentario());
            // Otros campos
            return proveedorRepository.save(p);
        }).orElse(null);
    }

    public void eliminar(Long id) {
        proveedorRepository.deleteById(id);
    }
}