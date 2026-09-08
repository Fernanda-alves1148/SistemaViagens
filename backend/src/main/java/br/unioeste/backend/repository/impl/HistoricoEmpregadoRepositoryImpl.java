package br.unioeste.backend.repository.impl;

import java.util.Optional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;

import br.unioeste.backend.entity.HistoricoEmpregado;
import br.unioeste.backend.repository.HistoricoEmpregadoRepository;

@Repository
public class HistoricoEmpregadoRepositoryImpl implements HistoricoEmpregadoRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Optional<HistoricoEmpregado> findAtivoByMatricula(String matricula) {
        try {
            HistoricoEmpregado historico = em.createQuery(
                    "SELECT h FROM HistoricoEmpregado h " +
                    "LEFT JOIN FETCH h.cargo " +
                    "LEFT JOIN FETCH h.area " +
                    "WHERE h.empregado.matricula = :matricula " +
                    "AND h.dataFim IS NULL",
                    HistoricoEmpregado.class)
                .setParameter("matricula", matricula)
                .getSingleResult();
            return Optional.of(historico);
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<HistoricoEmpregado> findById(Integer id) {
        HistoricoEmpregado historico = em.find(HistoricoEmpregado.class, id);
        return Optional.ofNullable(historico);
    }
}