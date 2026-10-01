import {
    useNavigate
} from "react-router-dom";

import {
    entrar,
    USUARIOS_DEMO
} from "../auth/auth";

function Login() {
    const navigate = useNavigate();

    const gestor =
        USUARIOS_DEMO.find(
            usuario => usuario.idUsuario === 1
        );

    const colaborador =
        USUARIOS_DEMO.find(
            usuario => usuario.idUsuario === 2
        );

    function selecionar(usuario) {
        entrar(usuario);

        navigate(
            usuario.perfil === "GESTOR"
                ? "/gestao"
                : "/"
        );
    }

    const perfis = [
        {
            usuario: colaborador,
            titulo: "Acessar como colaborador",
            descricao:
                "Criar, editar, solicitar e acompanhar viagens.",
            icone: "👤",
            cor: "#c98259"
        },
        {
            usuario: gestor,
            titulo: "Acessar como gestor",
            descricao:
                "Analisar solicitações e visualizar indicadores.",
            icone: "✓",
            cor: "#7d8f72"
        }
    ];

    return (
        <main
            style={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                background: "#f6f3ed",
                padding: "24px"
            }}
        >
            <section
                style={{
                    width: "min(820px, 100%)",
                    background: "#ffffff",
                    borderRadius: "18px",
                    padding: "40px",
                    boxShadow:
                        "0 16px 45px rgba(64, 56, 45, 0.12)"
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        marginBottom: "12px"
                    }}
                >
                    <div
                        style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "14px",
                            display: "grid",
                            placeItems: "center",
                            background: "#7d8f72",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "18px"
                        }}
                    >
                        GV
                    </div>

                    <div>
                        <h1
                            style={{
                                margin: 0,
                                color: "#30352e"
                            }}
                        >
                            Gestão de Viagens
                        </h1>

                        <p
                            style={{
                                margin: "4px 0 0",
                                color: "#777"
                            }}
                        >
                            Portal corporativo
                        </p>
                    </div>
                </div>

                <hr
                    style={{
                        border: 0,
                        borderTop:
                            "1px solid #ece7de",
                        margin: "28px 0"
                    }}
                />

                <h2
                    style={{
                        marginBottom: "6px",
                        color: "#30352e"
                    }}
                >
                    Selecione o perfil de acesso
                </h2>

                <p
                    style={{
                        color: "#777",
                        marginTop: 0
                    }}
                >
                    Escolha um perfil para iniciar a demonstração.
                </p>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "18px",
                        marginTop: "28px"
                    }}
                >
                    {perfis.map(item => (
                        <button
                            key={item.usuario.idUsuario}
                            type="button"
                            onClick={() =>
                                selecionar(item.usuario)
                            }
                            style={{
                                border:
                                    "1px solid #e4ded3",
                                borderRadius: "14px",
                                background: "#fff",
                                padding: "24px",
                                cursor: "pointer",
                                textAlign: "left",
                                boxShadow:
                                    "0 6px 18px rgba(0,0,0,.06)"
                            }}
                        >
                            <div
                                style={{
                                    width: "46px",
                                    height: "46px",
                                    borderRadius: "12px",
                                    display: "grid",
                                    placeItems: "center",
                                    background: item.cor,
                                    color: "white",
                                    fontSize: "22px",
                                    marginBottom: "18px"
                                }}
                            >
                                {item.icone}
                            </div>

                            <strong
                                style={{
                                    display: "block",
                                    color: "#30352e",
                                    fontSize: "17px",
                                    marginBottom: "8px"
                                }}
                            >
                                {item.titulo}
                            </strong>

                            <span
                                style={{
                                    display: "block",
                                    color: "#777",
                                    lineHeight: 1.5,
                                    marginBottom: "16px"
                                }}
                            >
                                {item.descricao}
                            </span>

                            <small
                                style={{
                                    color: item.cor,
                                    fontWeight: "bold"
                                }}
                            >
                                {item.usuario.nome} •{" "}
                                {item.usuario.matricula}
                            </small>
                        </button>
                    ))}
                </div>

                <p
                    style={{
                        textAlign: "center",
                        margin: "28px 0 0",
                        color: "#8a857d",
                        fontSize: "13px"
                    }}
                >
                    Ambiente acadêmico de demonstração
                </p>
            </section>
        </main>
    );
}

export default Login;