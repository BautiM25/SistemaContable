package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.SolicitudCompra;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.SolicitudCompraRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SolicitudCompraService {

    private final SolicitudCompraRepository repository;

    public SolicitudCompraService(SolicitudCompraRepository repository) {
        this.repository = repository;
    }

    public List<SolicitudCompra> listarTodas() {
        return repository.findAll();
    }

    public Optional<SolicitudCompra> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public SolicitudCompra guardar(SolicitudCompra solicitud) {
        if (solicitud.getDetalles() != null) {
            for (var detalle : solicitud.getDetalles()) {
                detalle.setSolicitud(solicitud); // 🔥 ¡clave!
            }
        }
        return repository.save(solicitud);
    }


    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}

