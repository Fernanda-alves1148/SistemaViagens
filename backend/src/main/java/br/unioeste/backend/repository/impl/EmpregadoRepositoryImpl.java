package br.unioeste.backend.repository.impl;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;

import br.unioeste.backend.entity.Empregado;
import br.unioeste.backend.repository.EmpregadoRepository;

@Repository
public class EmpregadoRepositoryImpl implements EmpregadoRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Optional<Empregado> findById(String matricula) {
        Empregado empregado = em.find(Empregado.class, matricula);
        return Optional.ofNullable(empregado);
    }

    @Override
    public List<Empregado> findAll() {
        return em.createQuery("SELECT e FROM Empregado e ORDER BY e.nome", Empregado.class)
                 .getResultList();
    }
}