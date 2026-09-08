package br.unioeste.backend.repository;

import java.util.List;

import br.unioeste.backend.entity.HistoricoStatusViagem;

public interface HistoricoStatusViagemRepository {
    List<HistoricoStatusViagem> findByViagemId(Integer idViagem);
}