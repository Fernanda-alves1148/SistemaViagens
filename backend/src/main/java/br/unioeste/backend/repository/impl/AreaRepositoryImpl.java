package br.unioeste.backend.repository.impl;

import java.util.Optional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;

import br.unioeste.backend.entity.Area;
import br.unioeste.backend.repository.AreaRepository;

@Repository
public class AreaRepositoryImpl implements AreaRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Optional<Area> findById(Integer id) {
        Area area = em.find(Area.class, id);
        return Optional.ofNullable(area);
    }

    @Override
public java.util.List<Area> findAll() {
    return em.createQuery(
        "SELECT a FROM Area a ORDER BY a.nome",
        Area.class
    ).getResultList();
}

@Override
public Area save(Area area) {
    em.persist(area);
    return area;
}

}