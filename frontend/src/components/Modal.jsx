function Modal({
    titulo,
    children,
    onClose
}) {

    return (
        <div className="modal-overlay">

            <div className="modal">

                <div className="modal-cabecalho">

                    <h3>
                        {titulo}
                    </h3>

                    <button
                        className="botao-fechar"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>

                <div className="modal-conteudo">

                    {children}

                </div>

                <div className="modal-acoes">

                    <button
                        onClick={onClose}
                    >
                        Fechar
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Modal;