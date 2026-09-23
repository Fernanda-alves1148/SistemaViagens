package br.unioeste.backend.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.Normalizer;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.unioeste.backend.dto.FinanceiroDtos.CriarDespesaRequest;
import br.unioeste.backend.dto.FinanceiroDtos.CustosViagemResponse;
import br.unioeste.backend.dto.FinanceiroDtos.DashboardResponse;
import br.unioeste.backend.dto.FinanceiroDtos.DespesaResponse;
import br.unioeste.backend.dto.FinanceiroDtos.TipoDespesaResponse;
import br.unioeste.backend.entity.Despesa;
import br.unioeste.backend.entity.TipoDespesa;
import br.unioeste.backend.entity.Viagem;
import br.unioeste.backend.exception.RecursoNaoEncontradoException;
import br.unioeste.backend.exception.RegraNegocioException;
import br.unioeste.backend.repository.DespesaRepository;
import br.unioeste.backend.repository.TipoDespesaRepository;
import br.unioeste.backend.repository.ViagemRepository;

@Service
public class FinanceiroService {

    private final DespesaRepository despesaRepository;
    private final TipoDespesaRepository tipoRepository;
    private final ViagemRepository viagemRepository;

    public FinanceiroService(
        DespesaRepository despesaRepository,
        TipoDespesaRepository tipoRepository,
        ViagemRepository viagemRepository
    ) {
        this.despesaRepository = despesaRepository;
        this.tipoRepository = tipoRepository;
        this.viagemRepository = viagemRepository;
    }

    @Transactional(readOnly = true)
    public List<TipoDespesaResponse> listarTipos() {
        return tipoRepository.findAll()
            .stream()
            .map(TipoDespesaResponse::de)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<DespesaResponse> listarDespesas(Integer idViagem) {
        buscarViagem(idViagem);

        return despesaRepository.findByViagemId(idViagem)
            .stream()
            .map(DespesaResponse::de)
            .toList();
    }

    @Transactional
    public DespesaResponse registrar(
        Integer idViagem,
        CriarDespesaRequest request
    ) {
        Viagem viagem = buscarViagem(idViagem);

        if (!"Aprovada".equalsIgnoreCase(
            viagem.getStatus().getNome()
        )) {
            throw new RegraNegocioException(
                "Despesas só podem ser registradas em viagens aprovadas."
            );
        }

        if (request.dataDespesa().isAfter(LocalDate.now())) {
            throw new RegraNegocioException(
                "A data da despesa não pode ser futura."
            );
        }

        TipoDespesa tipo = tipoRepository
            .findById(request.idTipo())
            .orElseThrow(() -> new RecursoNaoEncontradoException(
                "Tipo de despesa não encontrado."
            ));

        Despesa despesa = new Despesa(
            request.dataDespesa(),
            request.descricao().trim(),
            request.valor(),
            viagem,
            tipo
        );

        return DespesaResponse.de(
            despesaRepository.save(despesa)
        );
    }

    @Transactional
    public void excluir(Integer idDespesa) {
        Despesa despesa = despesaRepository
            .findById(idDespesa)
            .orElseThrow(() -> new RecursoNaoEncontradoException(
                "Despesa não encontrada (ID: " + idDespesa + ")"
            ));

        despesaRepository.delete(despesa);
    }

    @Transactional(readOnly = true)
    public CustosViagemResponse calcularCustos(Integer idViagem) {
        buscarViagem(idViagem);

        return somarCustos(
            despesaRepository.findByViagemId(idViagem)
        );
    }

    @Transactional(readOnly = true)
    public DashboardResponse dashboard() {
        List<Viagem> viagens = viagemRepository.findAll();
        List<Despesa> despesas = despesaRepository.findAll();

        long aprovadas = viagens.stream()
            .filter(v -> "Aprovada".equalsIgnoreCase(
                v.getStatus().getNome()
            ))
            .count();

        long rejeitadas = viagens.stream()
            .filter(v -> "Rejeitada".equalsIgnoreCase(
                v.getStatus().getNome()
            ))
            .count();

        BigDecimal custoTotal = somarCustos(despesas).total();

        long viagensComDespesa = despesas.stream()
            .map(d -> d.getViagem().getId())
            .distinct()
            .count();

        BigDecimal custoMedio = viagensComDespesa == 0
            ? BigDecimal.ZERO.setScale(2)
            : custoTotal.divide(
                BigDecimal.valueOf(viagensComDespesa),
                2,
                RoundingMode.HALF_UP
            );

        return new DashboardResponse(
            viagens.size(),
            aprovadas,
            rejeitadas,
            custoTotal,
            custoMedio
        );
    }

    private Viagem buscarViagem(Integer idViagem) {
        return viagemRepository.findById(idViagem)
            .orElseThrow(() -> new RecursoNaoEncontradoException(
                "Viagem não encontrada (ID: " + idViagem + ")"
            ));
    }

    private CustosViagemResponse somarCustos(
        List<Despesa> despesas
    ) {
        BigDecimal deslocamento = BigDecimal.ZERO;
        BigDecimal hospedagem = BigDecimal.ZERO;
        BigDecimal taxi = BigDecimal.ZERO;

        for (Despesa despesa : despesas) {
            String tipo = normalizar(
                despesa.getTipo().getNome()
            );

            switch (tipo) {
                case "HOSPEDAGEM" ->
                    hospedagem = hospedagem.add(despesa.getValor());

                case "TAXI" ->
                    taxi = taxi.add(despesa.getValor());

                case "TRANSPORTE", "COMBUSTIVEL", "PEDAGIO" ->
                    deslocamento = deslocamento.add(despesa.getValor());

                default -> {
                    // Tipos fora do cálculo solicitado pelo professor.
                }
            }
        }

        BigDecimal total = deslocamento
            .add(hospedagem)
            .add(taxi);

        return new CustosViagemResponse(
            dinheiro(deslocamento),
            dinheiro(hospedagem),
            dinheiro(taxi),
            dinheiro(total)
        );
    }

    private String normalizar(String texto) {
        return Normalizer
            .normalize(texto, Normalizer.Form.NFD)
            .replaceAll("\\p{M}", "")
            .toUpperCase(Locale.ROOT);
    }

    private BigDecimal dinheiro(BigDecimal valor) {
        return valor.setScale(2, RoundingMode.HALF_UP);
    }
}