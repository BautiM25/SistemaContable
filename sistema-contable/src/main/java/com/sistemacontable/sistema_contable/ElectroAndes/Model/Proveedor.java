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

    @Column(name = "cuit")
    private String cuit;

    @Column(name = "telefono1")
    private String telefono1;

    @Column(name = "telefono2")
    private String telefono2;

    @Column(name = "email")
    private String email;

    @Column(name = "direccion")
    private String direccion;

    @Column(name = "codigo_postal")
    private String codigoPostal;

    @Column(name = "ciudad")
    private String ciudad;

    @Column(name = "provincia")
    private String provincia;

    @Column(name = "pais")
    private String pais;

    @Column(name = "inscripcion_municipal")
    private String inscripcionMunicipal;

    @Column(name = "categoria_iva")
    private String categoriaIVA;

    @Column(name = "tipo_contribuyente")
    private String tipoContribuyente;

    @Column(name = "rubro")
    private String rubro;

    @Column(name = "banco")
    private String banco;

    @Column(name = "forma_pago")
    private String formaPago;

    @Column(name = "porcentaje_percepcion")
    private Double porcentajePercepcion;

    @Column(name = "porcentaje_descuento")
    private Double porcentajeDescuento;

    @Column(name = "porcentaje_iva_fletes")
    private Double porcentajeIvaFletes;

    @Column(name = "subcuenta")
    private String subcuenta;

    @Column(name = "subcta_saldo_favor")
    private String subctaSaldoFavor;

    @Column(name = "comentario", columnDefinition = "TEXT")
    private String comentario;

    @Column(name = "contacto")
    private String personaContacto;

    @Column(name = "fax")
    private String fax;

    // Getters y setters generados automáticamente

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getRazonSocial() { return razonSocial; }

    public void setRazonSocial(String razonSocial) { this.razonSocial = razonSocial; }

    public String getCuit() { return cuit; }

    public void setCuit(String cuit) { this.cuit = cuit; }

    public String getTelefono1() { return telefono1; }

    public void setTelefono1(String telefono1) { this.telefono1 = telefono1; }

    public String getTelefono2() { return telefono2; }

    public void setTelefono2(String telefono2) { this.telefono2 = telefono2; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getDireccion() { return direccion; }

    public void setDireccion(String direccion) { this.direccion = direccion; }

    public String getCodigoPostal() { return codigoPostal; }

    public void setCodigoPostal(String codigoPostal) { this.codigoPostal = codigoPostal; }

    public String getCiudad() { return ciudad; }

    public void setCiudad(String ciudad) { this.ciudad = ciudad; }

    public String getProvincia() { return provincia; }

    public void setProvincia(String provincia) { this.provincia = provincia; }

    public String getPais() { return pais; }

    public void setPais(String pais) { this.pais = pais; }

    public String getInscripcionMunicipal() { return inscripcionMunicipal; }

    public void setInscripcionMunicipal(String inscripcionMunicipal) { this.inscripcionMunicipal = inscripcionMunicipal; }

    public String getCategoriaIVA() { return categoriaIVA; }

    public void setCategoriaIVA(String categoriaIVA) { this.categoriaIVA = categoriaIVA; }

    public String getTipoContribuyente() { return tipoContribuyente; }

    public void setTipoContribuyente(String tipoContribuyente) { this.tipoContribuyente = tipoContribuyente; }

    public String getRubro() { return rubro; }

    public void setRubro(String rubro) { this.rubro = rubro; }

    public String getBanco() { return banco; }

    public void setBanco(String banco) { this.banco = banco; }

    public String getFormaPago() { return formaPago; }

    public void setFormaPago(String formaPago) { this.formaPago = formaPago; }

    public Double getPorcentajePercepcion() { return porcentajePercepcion; }

    public void setPorcentajePercepcion(Double porcentajePercepcion) { this.porcentajePercepcion = porcentajePercepcion; }

    public Double getPorcentajeDescuento() { return porcentajeDescuento; }

    public void setPorcentajeDescuento(Double porcentajeDescuento) { this.porcentajeDescuento = porcentajeDescuento; }

    public Double getPorcentajeIvaFletes() { return porcentajeIvaFletes; }

    public void setPorcentajeIvaFletes(Double porcentajeIvaFletes) { this.porcentajeIvaFletes = porcentajeIvaFletes; }

    public String getSubcuenta() { return subcuenta; }

    public void setSubcuenta(String subcuenta) { this.subcuenta = subcuenta; }

    public String getSubctaSaldoFavor() { return subctaSaldoFavor; }

    public void setSubctaSaldoFavor(String subctaSaldoFavor) { this.subctaSaldoFavor = subctaSaldoFavor; }

    public String getComentario() { return comentario; }

    public void setComentario(String comentario) { this.comentario = comentario; }

    public String getPersonaContacto() { return personaContacto; }

    public void setPersonaContacto(String personaContacto) { this.personaContacto = personaContacto; }

    public String getFax() { return fax; }

    public void setFax(String fax) { this.fax = fax; }
}
