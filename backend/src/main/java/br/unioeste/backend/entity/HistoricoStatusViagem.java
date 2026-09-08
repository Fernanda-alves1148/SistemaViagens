package br.unioeste.backend.entity;

import java.time.LocalDateTime;

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
@Table(name = "historico_status_viagem")
public class HistoricoStatusViagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historico_status")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_viagem", nullable = false)
    private Viagem viagem;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_status", nullable = false)
    private StatusViagem status;

    @Column(name = "data_alteracao", nullable = false)
    private LocalDateTime dataAlteracao;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_usuario_responsavel", nullable = false)
    private Usuario usuarioResponsavel;

    @Column(name = "observacao", columnDefinition = "TEXT")
    private String observacao;

    protected HistoricoStatusViagem() {
    }

    public Integer getId() {
        return id;
    }

    public Viagem getViagem() {
        return viagem;
    }

    public StatusViagem getStatus() {
        return status;
    }

    public LocalDateTime getDataAlteracao() {
        return dataAlteracao;
    }

    public Usuario getUsuarioResponsavel() {
        return usuarioResponsavel;
    }

    public String getObservacao() {
        return observacao;
    }
}