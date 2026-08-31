package br.unioeste.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "responsavel")
public class Responsavel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "matricula")
    private Integer matricula;

    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @Column(name = "cpf", nullable = false, length = 20)
    private String cpf;

    @Column(name = "nro", nullable = false)
    private Integer numero;

    @Column(name = "complemento", nullable = false, length = 20)
    private String complemento;

    @Column(name = "setor", nullable = false, length = 20)
    private String setor;

    @Column(name = "idendereco")
    private Integer idEndereco;

    protected Responsavel() {
    }

    public Integer getMatricula() {
        return matricula;
    }

    public String getNome() {
        return nome;
    }

    public String getCpf() {
        return cpf;
    }

    public String getSetor() {
        return setor;
    }
}