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
@Table(name = "historico_empregado")
public class HistoricoEmpregado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historico_empregado")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "matricula", nullable = false)
    private Empregado empregado;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_cargo", nullable = false)
    private Cargo cargo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_area", nullable = false)
    private Area area;

    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;

    @Column(name = "data_fim")
    private LocalDate dataFim;

    protected HistoricoEmpregado() {
    }


    public HistoricoEmpregado(
    Empregado empregado,
    Cargo cargo,
    Area area,
    LocalDate dataInicio
) {
    this.empregado = empregado;
    this.cargo = cargo;
    this.area = area;
    this.dataInicio = dataInicio;
    this.dataFim = null;
}
    public Integer getId() {
        return id;
    }

    public Empregado getEmpregado() {
        return empregado;
    }

    public Cargo getCargo() {
        return cargo;
    }

    public Area getArea() {
        return area;
    }

    public LocalDate getDataInicio() {
        return dataInicio;
    }

    public LocalDate getDataFim() {
        return dataFim;
    }
    public void encerrarEm(LocalDate dataFim) {
    this.dataFim = dataFim;
}
}