package br.unioeste.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import br.unioeste.backend.entity.Despesa;
import br.unioeste.backend.entity.TipoDespesa;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public final class FinanceiroDtos {

    private FinanceiroDtos() {
    }

    public record CriarDespesaRequest(
        @NotNull(message = "A data é obrigatória")
        LocalDate dataDespesa,

        @NotBlank(message = "A descrição é obrigatória")
        @Size(max = 200, message = "A descrição deve ter no máximo 200 caracteres")
        String descricao,

        @NotNull(message = "O valor é obrigatório")
        @DecimalMin(value = "0.01", message = "O valor deve ser maior que zero")
        BigDecimal valor,

        @NotNull(message = "O tipo da despesa é obrigatório")
        Integer idTipo
    ) {
    }

    public record DespesaResponse(
        Integer id,
        LocalDate dataDespesa,
        String descricao,
        BigDecimal valor,
        Integer idTipo,
        String tipo
    ) {
        public static DespesaResponse de(Despesa despesa) {
            return new DespesaResponse(
                despesa.getId(),
                despesa.getDataDespesa(),
                despesa.getDescricao(),
                despesa.getValor(),
                despesa.getTipo().getId(),
                despesa.getTipo().getNome()
            );
        }
    }

    public record TipoDespesaResponse(
        Integer id,
        String nome
    ) {
        public static TipoDespesaResponse de(TipoDespesa tipo) {
            return new TipoDespesaResponse(
                tipo.getId(),
                tipo.getNome()
            );
        }
    }

    public record CustosViagemResponse(
        BigDecimal deslocamento,
        BigDecimal hospedagem,
        BigDecimal taxi,
        BigDecimal total
    ) {
    }

    public record DashboardResponse(
        long totalViagens,
        long viagensAprovadas,
        long viagensRejeitadas,
        BigDecimal custoTotal,
        BigDecimal custoMedioPorViagem
    ) {
    }
}