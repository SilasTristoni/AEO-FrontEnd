import React from 'react';

function EntityForm({
    entity,
    setEntity,
    fields,
    onSubmit,
    isEditing,
    onCancelEdit,
    submitButtonText
}) {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEntity(prevState => ({ ...prevState, [name]: value }));
    };

    return (
        <form onSubmit={onSubmit} className="entity-form">
            <h2>{isEditing ? `Editar ${fields[0].label}` : `Criar Novo(a) ${fields[0].label}`}</h2>
            
            {fields.map(field => (
                <div key={field.name} className="form-group">
                    <label htmlFor={field.name}>{field.label}</label>
                    {field.type === 'select' ? (
                        <select
                            id={field.name}
                            name={field.name}
                            value={entity?.[field.name] || ''}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="" disabled>Selecione uma opção</option>
                            {field.options.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            value={entity?.[field.name] || ''}
                            onChange={handleInputChange}
                            placeholder={`Digite o ${field.label.toLowerCase()}...`}
                            required
                        />
                    )}
                </div>
            ))}
            
            <div className="form-actions">
                <button type="submit">{submitButtonText}</button>
                {isEditing && (
                    <button type="button" onClick={onCancelEdit} className="cancel-button">
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
}

export default EntityForm;