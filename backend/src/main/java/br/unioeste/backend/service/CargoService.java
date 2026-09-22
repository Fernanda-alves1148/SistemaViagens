package br.unioeste.backend.service;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.unioeste.backend.dto.CadastroNomeRequest;
import br.unioeste.backend.dto.CadastroNomeResponse;
import br.unioeste.backend.entity.Cargo;
import br.unioeste.backend.exception.RegraNegocioException;
import br.unioeste.backend.repository.CargoRepository;

@Service
public class CargoService {

    private static final Set<String> CARGOS_PERMITIDOS =
        Set.of("COLABORADOR", "GESTOR");

    private final CargoRepository repository;

    public CargoService(CargoRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<CadastroNomeResponse> listar() {
        return repository.findAll()
            .stream()
            .map(cargo -> new CadastroNomeResponse(
                cargo.getId(),
                cargo.getNome()
            ))
            .toList();
    }

    @Transactional
    public CadastroNomeResponse cadastrar(CadastroNomeRequest request) {
        String nome = request.nome().trim().toUpperCase();

        if (!CARGOS_PERMITIDOS.contains(nome)) {
            throw new RegraNegocioException(
                "O cargo deve ser COLABORADOR ou GESTOR."
            );
        }

        boolean existente = repository.findAll()
            .stream()
            .anyMatch(cargo -> cargo.getNome().equalsIgnoreCase(nome));

        if (existente) {
            throw new RegraNegocioException(
                "Já existe um cargo com esse nome."
            );
        }

        Cargo cargo = repository.save(new Cargo(nome));

        return new CadastroNomeResponse(cargo.getId(), cargo.getNome());
    }
}