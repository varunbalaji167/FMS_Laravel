import { useCallback } from 'react';

export default function DynamicForm({ schema, uiSchema, formData, onChange }) {
    const handleFieldChange = useCallback(
        (fieldName, value) => {
            onChange({
                ...formData,
                [fieldName]: value,
            });
        },
        [formData, onChange]
    );

    const renderField = (fieldName, fieldSchema) => {
        const value = formData[fieldName] || '';
        const fieldUiSchema = uiSchema?.[fieldName] || {};
        const type = fieldSchema.type || 'string';

        const commonProps = {
            id: fieldName,
            value: value,
            onChange: (e) => handleFieldChange(fieldName, e.target.value),
            className:
                'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
            placeholder: fieldSchema.description || '',
        };

        switch (type) {
            case 'string':
                if (fieldUiSchema['ui:widget'] === 'textarea') {
                    return (
                        <textarea
                            {...commonProps}
                            rows={fieldUiSchema['ui:options']?.rows || 4}
                        />
                    );
                } else if (fieldSchema.enum) {
                    return (
                        <select {...commonProps}>
                            <option value="">Select {fieldSchema.title}</option>
                            {fieldSchema.enum.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    );
                } else if (fieldUiSchema['ui:widget'] === 'email') {
                    return <input {...commonProps} type="email" />;
                } else if (fieldUiSchema['ui:widget'] === 'date') {
                    return <input {...commonProps} type="date" />;
                } else if (fieldUiSchema['ui:widget'] === 'phone') {
                    return <input {...commonProps} type="tel" />;
                }
                return <input {...commonProps} type="text" />;

            case 'number':
            case 'integer':
                return <input {...commonProps} type="number" />;

            case 'boolean':
                return (
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={value === true}
                            onChange={(e) => handleFieldChange(fieldName, e.target.checked)}
                            className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{fieldSchema.title}</span>
                    </label>
                );

            default:
                return <input {...commonProps} type="text" />;
        }
    };

    if (!schema.properties || Object.keys(schema.properties).length === 0) {
        return <div className="p-4 bg-gray-50 text-gray-600">No fields configured</div>;
    }

    return (
        <div className="space-y-6">
            {Object.entries(schema.properties).map(([fieldName, fieldSchema]) => (
                <div key={fieldName}>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                        {fieldSchema.title || fieldName}
                        {fieldSchema.required && <span className="text-red-600 ml-1">*</span>}
                    </label>
                    {fieldSchema.description && (
                        <p className="text-sm text-gray-600 mb-2">{fieldSchema.description}</p>
                    )}
                    {renderField(fieldName, fieldSchema)}
                </div>
            ))}
        </div>
    );
}
