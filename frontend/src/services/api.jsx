const API_BASE_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:8080/api"
).replace(/\/$/, "");

export class ApiError extends Error {
    constructor(message, status, body = null) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.body = body;
    }
}

async function lerResposta(response) {
    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        return response.json();
    }

    const texto = await response.text();
    return texto || null;
}

function mensagemDoErro(body, status) {
    if (body && typeof body === "object") {
        return body.message || body.mensagem || body.error || `Erro HTTP ${status}`;
    }

    return typeof body === "string" && body.trim()
        ? body
        : `Erro HTTP ${status}`;
}

export async function request(path, options = {}) {
    const { params, headers = {}, ...fetchOptions } = options;
    const url = new URL(`${API_BASE_URL}${path}`);

    if (params) {
        Object.entries(params).forEach(([chave, valor]) => {
            if (valor !== undefined && valor !== null && valor !== "") {
                url.searchParams.set(chave, valor);
            }
        });
    }

    const response = await fetch(url, {
        ...fetchOptions,
        headers: {
            Accept: "application/json",
            ...(fetchOptions.body !== undefined
                ? { "Content-Type": "application/json" }
                : {}),
            ...headers
        }
    });

    const body = await lerResposta(response);

    if (!response.ok) {
        throw new ApiError(
            mensagemDoErro(body, response.status),
            response.status,
            body
        );
    }

    return body;
}

export const api = {
    get: (path, params) => request(path, { method: "GET", params }),
    post: (path, body) => request(path, {
        method: "POST",
        body: JSON.stringify(body)
    }),
    put: (path, body) => request(path, {
        method: "PUT",
        body: JSON.stringify(body)
    }),
    patch: (path, body = {}) => request(path, {
        method: "PATCH",
        body: JSON.stringify(body)
    }),
    delete: (path) => request(path, { method: "DELETE" })
};

export default api;
