function Modal({ titulo, onClose, children }) {

    return (

        <div
            className="modal-overlay"
            onClick={onClose}
        >

            <div
                className="modal-conteudo"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >

                <div className="modal-cabecalho">

                    <h3>
                        {titulo}
                    </h3>

                    <button
                        type="button"
                        className="modal-fechar"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>


                <div className="modal-corpo">
                    {children}
                </div>

            </div>

        </div>
    );
}

export default Modal;