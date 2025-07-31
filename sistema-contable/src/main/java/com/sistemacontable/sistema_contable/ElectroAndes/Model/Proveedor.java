package com.sistemacontable.sistema_contable.ElectroAndes.Model;


import jakarta.persistence.*;

@Entity
@Table(name = "proveedores")
public class Proveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_proveedor")
    private Long id;

    @Column(name = "razon_social", nullable = false)
    private String razonSocial;

    @Column(name = "telefono")
    private Integer telefono;

    @Column(name = "cuit")
    private Integer cuit;

    @Column(name = "rubro")
    private String rubro;

    @Column(name = "direccion")
    private String direccion;

    // Constructores


    public Proveedor() {}

    public Proveedor(String razonSocial, Integer telefono, Integer cuit, String rubro, String direccion) {
        this.razonSocial = razonSocial;
        this.telefono = telefono;
        this.cuit = cuit;
        this.rubro = rubro;
        this.direccion = direccion;
    }


    // Getters y Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRazonSocial() {
        return razonSocial;
    }

    public void setRazonSocial(String razonSocial) {
        this.razonSocial = razonSocial;
    }

    public Integer getTelefono() {
        return telefono;
    }

    public void setTelefono(Integer telefono) {
        this.telefono = telefono;
    }

    public Integer getCuit() {
        return cuit;
    }

    public void setCuit(Integer cuit) {
        this.cuit = cuit;
    }

    public String getRubro() {
        return rubro;
    }

    public void setRubro(String rubro) {
        this.rubro = rubro;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
}

