export default function JsonViewer({ data }) {
    const renderValue = (value, depth = 0) => {
        const indent = depth * 20;

        if (value === null || value === undefined) {
            return <span className="text-gray-500">null</span>;
        }

        if (typeof value === 'boolean') {
            return <span className="text-blue-600">{value ? 'true' : 'false'}</span>;
        }

        if (typeof value === 'number') {
            return <span className="text-green-600">{value}</span>;
        }

        if (typeof value === 'string') {
            return <span className="text-red-600">"{value}"</span>;
        }

        if (Array.isArray(value)) {
            if (value.length === 0) {
                return <span className="text-gray-600">[]</span>;
            }

            return (
                <div className="ml-4">
                    <span className="text-gray-600">[</span>
                    {value.map((item, index) => (
                        <div key={index}>
                            <div className="ml-4">
                                {renderValue(item, depth + 1)}
                                {index < value.length - 1 && ','}
                            </div>
                        </div>
                    ))}
                    <span className="text-gray-600">]</span>
                </div>
            );
        }

        if (typeof value === 'object') {
            const entries = Object.entries(value);
            if (entries.length === 0) {
                return <span className="text-gray-600">{'{}'}</span>;
            }

            return (
                <div className="ml-4">
                    <span className="text-gray-600">{'{'}</span>
                    {entries.map(([key, val], index) => (
                        <div key={key} className="ml-4">
                            <span className="text-purple-600">"{key}"</span>
                            <span className="text-gray-600">: </span>
                            {renderValue(val, depth + 1)}
                            {index < entries.length - 1 && <span className="text-gray-600">,</span>}
                        </div>
                    ))}
                    <span className="text-gray-600">{'}'}</span>
                </div>
            );
        }

        return <span>{String(value)}</span>;
    };

    return (
        <div className="bg-gray-50 border border-gray-200 rounded p-4 overflow-x-auto">
            <pre className="font-mono text-sm text-gray-800 whitespace-pre-wrap break-words">
                {renderValue(data)}
            </pre>
        </div>
    );
}
