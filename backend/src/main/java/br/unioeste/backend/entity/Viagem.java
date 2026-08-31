package br.unioeste.backend.entity;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "viagem")
public class Viagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idviagem")
    private Integer id;

    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;

    @Column(name = "data_fim", nullable = false)
    private LocalDate dataFim;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idorigem", nullable = false)
    private Cidade origem;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "iddestino", nullable = false)
    private Cidade destino;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idmotivo")
    private Motivo motivo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idstatus", nullable = false)
    private StatusViagem status;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "matricula", nullable = false)
    private Responsavel responsavel;

    @ManyToMany
    @JoinTable(
        name = "transporte",
        joinColumns = @JoinColumn(name = "idviagem"),
        inverseJoinColumns = @JoinColumn(name = "idmeio")
    )
    private Set<MeioTransporte> meiosTransporte = new LinkedHashSet<>();

    protected Viagem() {
    }

    public Viagem(
        LocalDate dataInicio,
        LocalDate dataFim,
        Cidade origem,
        Cidade destino,
        Motivo motivo,
        StatusViagem status,
        Responsavel responsavel,
        Set<MeioTransporte> meiosTransporte
    ) {
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.origem = origem;
        this.destino = destino;
        this.motivo = motivo;
        this.status = status;
        this.responsavel = responsavel;
        this.meiosTransporte.addAll(meiosTransporte);
    }

    public Integer getId() {
        return id;
    }

    public LocalDate getDataInicio() {
        return dataInicio;
    }

    public LocalDate getDataFim() {
        return dataFim;
    }

    public Cidade getOrigem() {
        return origem;
    }

    public Cidade getDestino() {
        return destino;
    }

    public Motivo getMotivo() {
        return motivo;
    }

    public StatusViagem getStatus() {
        return status;
    }

    public Responsavel getResponsavel() {
        return responsavel;
    }

    public Set<MeioTransporte> getMeiosTransporte() {
        return meiosTransporte;
    }
}