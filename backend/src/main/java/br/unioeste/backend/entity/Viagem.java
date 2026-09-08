package br.unioeste.backend.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "viagem")
public class Viagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_viagem")
    private Integer id;

    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;

    @Column(name = "data_fim", nullable = false)
    private LocalDate dataFim;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_origem", nullable = false)
    private Cidade origem;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_destino", nullable = false)
    private Cidade destino;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_motivo", nullable = false)
    private Motivo motivo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_meio_transporte", nullable = false)
    private MeioTransporte meioTransporte;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_status", nullable = false)
    private StatusViagem status;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "matricula_solicitante", nullable = false)
    private Empregado solicitante;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_historico_empregado", nullable = false)
    private HistoricoEmpregado historicoEmpregado;

    @Column(name = "justificativa", columnDefinition = "TEXT")
    private String justificativa;

    protected Viagem() {
    }

    public Viagem(
        LocalDate dataInicio,
        LocalDate dataFim,
        Cidade origem,
        Cidade destino,
        Motivo motivo,
        MeioTransporte meioTransporte,
        StatusViagem status,
        Empregado solicitante,
        HistoricoEmpregado historicoEmpregado,
        String justificativa
    ) {
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.origem = origem;
        this.destino = destino;
        this.motivo = motivo;
        this.meioTransporte = meioTransporte;
        this.status = status;
        this.solicitante = solicitante;
        this.historicoEmpregado = historicoEmpregado;
        this.justificativa = justificativa;
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

    public MeioTransporte getMeioTransporte() {
        return meioTransporte;
    }

    public StatusViagem getStatus() {
        return status;
    }

    public Empregado getSolicitante() {
        return solicitante;
    }

    public HistoricoEmpregado getHistoricoEmpregado() {
        return historicoEmpregado;
    }

    public String getJustificativa() {
        return justificativa;
    }

    public void setStatus(StatusViagem status) {
        this.status = status;
    }

    public void setJustificativa(String justificativa) {
        this.justificativa = justificativa;
    }
}