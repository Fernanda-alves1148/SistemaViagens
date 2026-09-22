package br.unioeste.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.unioeste.backend.dto.CriarEmpregadoRequest;
import br.unioeste.backend.dto.EmpregadoResponse;
import br.unioeste.backend.entity.Area;
import br.unioeste.backend.entity.Cargo;
import br.unioeste.backend.entity.Empregado;
import br.unioeste.backend.entity.Endereco;
import br.unioeste.backend.entity.HistoricoEmpregado;
import br.unioeste.backend.exception.RecursoNaoEncontradoException;
import br.unioeste.backend.exception.RegraNegocioException;
import br.unioeste.backend.repository.AreaRepository;
import br.unioeste.backend.repository.CargoRepository;
import br.unioeste.backend.repository.EmpregadoRepository;
import br.unioeste.backend.repository.EnderecoRepository;
import br.unioeste.backend.repository.HistoricoEmpregadoRepository;
import br.unioeste.backend.dto.AlterarVinculoEmpregadoRequest;

@Service
public class EmpregadoService {

    private final EmpregadoRepository empregadoRepository;
    private final HistoricoEmpregadoRepository historicoRepository;
    private final EnderecoRepository enderecoRepository;
    private final CargoRepository cargoRepository;
    private final AreaRepository areaRepository;

    public EmpregadoService(
        EmpregadoRepository empregadoRepository,
        HistoricoEmpregadoRepository historicoRepository,
        EnderecoRepository enderecoRepository,
        CargoRepository cargoRepository,
        AreaRepository areaRepository
    ) {
        this.empregadoRepository = empregadoRepository;
        this.historicoRepository = historicoRepository;
        this.enderecoRepository = enderecoRepository;
        this.cargoRepository = cargoRepository;
        this.areaRepository = areaRepository;
    }

    @Transactional
    public EmpregadoResponse cadastrar(CriarEmpregadoRequest request) {
        String matricula = request.matricula().trim();
        String nome = request.nome().trim();
        String cpf = request.cpf().trim();

        if (empregadoRepository.findById(matricula).isPresent()) {
            throw new RegraNegocioException(
                "Já existe um empregado com essa matrícula."
            );
        }

        boolean cpfExistente = empregadoRepository.findAll()
            .stream()
            .anyMatch(empregado -> empregado.getCpf().equals(cpf));

        if (cpfExistente) {
            throw new RegraNegocioException(
                "Já existe um empregado com esse CPF."
            );
        }

        Endereco endereco = enderecoRepository
            .findById(request.idEndereco())
            .orElseThrow(() -> new RecursoNaoEncontradoException(
                "Endereço não encontrado."
            ));

        Cargo cargo = cargoRepository
            .findById(request.idCargo())
            .orElseThrow(() -> new RecursoNaoEncontradoException(
                "Cargo não encontrado."
            ));

        Area area = areaRepository
            .findById(request.idArea())
            .orElseThrow(() -> new RecursoNaoEncontradoException(
                "Área não encontrada."
            ));

        Empregado empregado = empregadoRepository.save(
            new Empregado(matricula, nome, cpf, endereco)
        );

        HistoricoEmpregado historico = historicoRepository.save(
            new HistoricoEmpregado(
                empregado,
                cargo,
                area,
                request.dataInicio()
            )
        );

        return converter(empregado, historico);
    }

    @Transactional(readOnly = true)
    public List<EmpregadoResponse> listar() {
        return empregadoRepository.findAll()
            .stream()
            .map(empregado -> {
                HistoricoEmpregado historico = historicoRepository
                    .findAtivoByMatricula(empregado.getMatricula())
                    .orElse(null);

                return converter(empregado, historico);
            })
            .toList();
    }
    @Transactional
public EmpregadoResponse alterarVinculo(
    String matricula,
    AlterarVinculoEmpregadoRequest request
) {
    Empregado empregado = empregadoRepository
        .findById(matricula)
        .orElseThrow(() -> new RecursoNaoEncontradoException(
            "Empregado não encontrado."
        ));

    HistoricoEmpregado historicoAtual = historicoRepository
        .findAtivoByMatricula(matricula)
        .orElseThrow(() -> new RecursoNaoEncontradoException(
            "O empregado não possui vínculo ativo."
        ));

    Cargo novoCargo = cargoRepository
        .findById(request.idCargo())
        .orElseThrow(() -> new RecursoNaoEncontradoException(
            "Cargo não encontrado."
        ));

    Area novaArea = areaRepository
        .findById(request.idArea())
        .orElseThrow(() -> new RecursoNaoEncontradoException(
            "Área não encontrada."
        ));

    if (!request.dataInicio().isAfter(
        historicoAtual.getDataInicio()
    )) {
        throw new RegraNegocioException(
            "O novo vínculo deve começar depois do vínculo atual."
        );
    }

    boolean mesmoCargo = historicoAtual
        .getCargo()
        .getId()
        .equals(novoCargo.getId());

    boolean mesmaArea = historicoAtual
        .getArea()
        .getId()
        .equals(novaArea.getId());

    if (mesmoCargo && mesmaArea) {
        throw new RegraNegocioException(
            "O cargo e a área informados são iguais ao vínculo atual."
        );
    }

    historicoAtual.encerrarEm(
        request.dataInicio().minusDays(1)
    );

    historicoRepository.flush();

    HistoricoEmpregado novoHistorico =
        historicoRepository.save(
            new HistoricoEmpregado(
                empregado,
                novoCargo,
                novaArea,
                request.dataInicio()
            )
        );

    return converter(empregado, novoHistorico);
}

    private EmpregadoResponse converter(
        Empregado empregado,
        HistoricoEmpregado historico
    ) {
        return new EmpregadoResponse(
            empregado.getMatricula(),
            empregado.getNome(),
            empregado.getCpf(),
            empregado.getAtivo(),
            empregado.getEndereco() != null
                ? empregado.getEndereco().getId()
                : null,
            historico != null ? historico.getCargo().getNome() : null,
            historico != null ? historico.getArea().getNome() : null,
            historico != null ? historico.getDataInicio() : null
        );
    }
}