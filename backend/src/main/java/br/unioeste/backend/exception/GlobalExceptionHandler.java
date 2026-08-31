package br.unioeste.backend.exception;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroResposta> tratarRecursoNaoEncontrado(
        RecursoNaoEncontradoException exception,
        HttpServletRequest request
    ) {
        ErroResposta resposta = new ErroResposta(
            LocalDateTime.now(),
            HttpStatus.NOT_FOUND.value(),
            "Recurso não encontrado",
            exception.getMessage(),
            request.getRequestURI(),
            Map.of()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resposta);
    }

    @ExceptionHandler(RegraNegocioException.class)
    public ResponseEntity<ErroResposta> tratarRegraNegocio(
        RegraNegocioException exception,
        HttpServletRequest request
    ) {
        ErroResposta resposta = new ErroResposta(
            LocalDateTime.now(),
            HttpStatus.BAD_REQUEST.value(),
            "Regra de negócio inválida",
            exception.getMessage(),
            request.getRequestURI(),
            Map.of()
        );

        return ResponseEntity.badRequest().body(resposta);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResposta> tratarCamposInvalidos(
        MethodArgumentNotValidException exception,
        HttpServletRequest request
    ) {
        Map<String, String> campos = new LinkedHashMap<>();

        exception.getBindingResult()
            .getFieldErrors()
            .forEach(erro -> campos.putIfAbsent(
                erro.getField(),
                erro.getDefaultMessage()
            ));

        ErroResposta resposta = new ErroResposta(
            LocalDateTime.now(),
            HttpStatus.BAD_REQUEST.value(),
            "Dados inválidos",
            "Um ou mais campos estão inválidos",
            request.getRequestURI(),
            campos
        );

        return ResponseEntity.badRequest().body(resposta);
    }
}