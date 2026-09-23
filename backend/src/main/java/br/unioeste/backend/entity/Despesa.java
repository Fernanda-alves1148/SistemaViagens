package br.unioeste.backend.entity;

import java.math.BigDecimal;
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
@Table(name = "despesa")
public class Despesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_despesa")
    private Integer id;

    @Column(name = "data_despesa", nullable = false)
    private LocalDate dataDespesa;

    @Column(name = "descricao", nullable = false, length = 200)
    private String descricao;

    @Column(name = "valor", nullable = false, precision = 12, scale = 2)
    private BigDecimal valor;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_viagem", nullable = false)
    private Viagem viagem;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_tipo", nullable = false)
    private TipoDespesa tipo;

    protected Despesa() {
    }

    public Despesa(
        LocalDate dataDespesa,
        String descricao,
        BigDecimal valor,
        Viagem viagem,
        TipoDespesa tipo
    ) {
        this.dataDespesa = dataDespesa;
        this.descricao = descricao;
        this.valor = valor;
        this.viagem = viagem;
        this.tipo = tipo;
    }

    public Integer getId() {
        return id;
    }

    public LocalDate getDataDespesa() {
        return dataDespesa;
    }

    public String getDescricao() {
        return descricao;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public Viagem getViagem() {
        return viagem;
    }

    public TipoDespesa getTipo() {
        return tipo;
    }
}