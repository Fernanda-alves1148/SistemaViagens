package br.unioeste.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.unioeste.backend.dto.CadastroNomeRequest;
import br.unioeste.backend.dto.CadastroNomeResponse;
import br.unioeste.backend.entity.Area;
import br.unioeste.backend.exception.RegraNegocioException;
import br.unioeste.backend.repository.AreaRepository;

@Service
public class AreaService {

    private final AreaRepository repository;

    public AreaService(AreaRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<CadastroNomeResponse> listar() {
        return repository.findAll()
            .stream()
            .map(area -> new CadastroNomeResponse(
                area.getId(),
                area.getNome()
            ))
            .toList();
    }

    @Transactional
    public CadastroNomeResponse cadastrar(CadastroNomeRequest request) {
        String nome = request.nome().trim();

        boolean existente = repository.findAll()
            .stream()
            .anyMatch(area -> area.getNome().equalsIgnoreCase(nome));

        if (existente) {
            throw new RegraNegocioException(
                "Já existe uma área com esse nome."
            );
        }

        Area area = repository.save(new Area(nome));

        return new CadastroNomeResponse(area.getId(), area.getNome());
    }
}