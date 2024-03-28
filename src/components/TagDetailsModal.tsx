interface TagDetailsModalProps {
    name: string;
    count: number;
    onClose: () => void;
}

const TagDetailsModal = ({name, count, onClose}:TagDetailsModalProps) => {
    return(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Tag Details</h2>
                <p>Name: {name}</p>
                <p>Count: {count}</p>
                <button className="close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default TagDetailsModal;