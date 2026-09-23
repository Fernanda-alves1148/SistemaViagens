package br.unioeste.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.unioeste.backend.dto.FinanceiroDtos.CriarDespesaRequest;
import br.unioeste.backend.dto.FinanceiroDtos.CustosViagemResponse;
import br.unioeste.backend.dto.FinanceiroDtos.DashboardResponse;
import br.unioeste.backend.dto.FinanceiroDtos.DespesaResponse;
import br.unioeste.backend.dto.FinanceiroDtos.TipoDespesaResponse;
import br.unioeste.backend.service.FinanceiroService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class FinanceiroController {

    private final FinanceiroService financeiroService;

    public FinanceiroController(
        FinanceiroService financeiroService
    ) {
        this.financeiroService = financeiroService;
    }

    @GetMapping("/tipos-despesa")
    public ResponseEntity<List<TipoDespesaResponse>> listarTipos() {
        return ResponseEntity.ok(
            financeiroService.listarTipos()
        );
    }

    @GetMapping("/viagens/{id}/despesas")
    public ResponseEntity<List<DespesaResponse>> listarDespesas(
        @PathVariable Integer id
    ) {
        return ResponseEntity.ok(
            financeiroService.listarDespesas(id)
        );
    }

    @PostMapping("/viagens/{id}/despesas")
    public ResponseEntity<DespesaResponse> registrar(
        @PathVariable Integer id,
        @Valid @RequestBody CriarDespesaRequest request
    ) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(financeiroService.registrar(id, request));
    }

    @DeleteMapping("/despesas/{id}")
    public ResponseEntity<Void> excluir(
        @PathVariable Integer id
    ) {
        financeiroService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/viagens/{id}/custos")
    public ResponseEntity<CustosViagemResponse> calcularCustos(
        @PathVariable Integer id
    ) {
        return ResponseEntity.ok(
            financeiroService.calcularCustos(id)
        );
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> dashboard() {
        return ResponseEntity.ok(
            financeiroService.dashboard()
        );
    }
}