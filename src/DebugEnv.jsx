import React from 'react';

export default function DebugEnv() {
    const envVars = {
        'VITE_FIREBASE_API_KEY': import.meta.env.VITE_FIREBASE_API_KEY,
        'VITE_FIREBASE_AUTH_DOMAIN': import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        'VITE_FIREBASE_PROJECT_ID': import.meta.env.VITE_FIREBASE_PROJECT_ID,
        'VITE_FIREBASE_STORAGE_BUCKET': import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        'VITE_FIREBASE_MESSAGING_SENDER_ID': import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        'VITE_FIREBASE_APP_ID': import.meta.env.VITE_FIREBASE_APP_ID,
        'VITE_FIREBASE_MEASUREMENT_ID': import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">🔍 Environment Variables Debug</h1>

            <div className="bg-gray-100 p-4 rounded-lg">
                {Object.entries(envVars).map(([key, value]) => (
                    <div key={key} className="mb-3 pb-3 border-b border-gray-300 last:border-0">
                        <div className="font-mono text-sm font-semibold text-blue-600">{key}</div>
                        <div className="font-mono text-xs mt-1">
                            {value ? (
                                <span className="text-green-600">✅ {value}</span>
                            ) : (
                                <span className="text-red-600">❌ UNDEFINED</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-bold text-yellow-800 mb-2">⚠️ Important Notes:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• All variables should show values (not UNDEFINED)</li>
                    <li>• If any are UNDEFINED, restart your dev server</li>
                    <li>• Vite only loads .env on server start</li>
                    <li>• Check that .env is in the project root</li>
                </ul>
            </div>
        </div>
    );
}
