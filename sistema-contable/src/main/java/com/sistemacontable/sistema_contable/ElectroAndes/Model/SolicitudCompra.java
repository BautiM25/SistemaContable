package com.sistemacontable.sistema_contable.ElectroAndes.Model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "solicitudes_compra")
public class SolicitudCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fecha;

    private String division;

    private String centroCosto;

    private String comentario;

    @OneToMany(mappedBy = "solicitud", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<DetalleSolicitudCompra> detalles;


    public SolicitudCompra(Long id, LocalDate fecha, String division, String centroCosto, String comentario, List<DetalleSolicitudCompra> detalles) {
        this.id = id;
        this.fecha = fecha;
        this.division = division;
        this.centroCosto = centroCosto;
        this.comentario = comentario;
        this.detalles = detalles;
    }

    public SolicitudCompra() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public String getDivision() {
        return division;
    }

    public void setDivision(String division) {
        this.division = division;
    }

    public String getCentroCosto() {
        return centroCosto;
    }

    public void setCentroCosto(String centroCosto) {
        this.centroCosto = centroCosto;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public List<DetalleSolicitudCompra> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetalleSolicitudCompra> detalles) {
        this.detalles = detalles;
    }

}
