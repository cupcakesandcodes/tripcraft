import React, { useState } from 'react';
import { auth, db, googleProvider } from './service/firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Button } from './components/ui/button';

export default function TestFirebase() {
    const [logs, setLogs] = useState([]);

    const addLog = (msg, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, { msg, type, timestamp }]);
    };

    const testConfig = () => {
        const config = {
            apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
            authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
            projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        };

        addLog("--- Checking Configuration ---");
        if (!config.apiKey) addLog("❌ VITE_FIREBASE_API_KEY is missing", 'error');
        else addLog(`✅ API Key loaded (${config.apiKey.slice(0, 5)}...)`);

        if (!config.authDomain) addLog("❌ VITE_FIREBASE_AUTH_DOMAIN is missing", 'error');
        else addLog(`✅ Auth Domain: ${config.authDomain}`);

        if (!config.projectId) addLog("❌ VITE_FIREBASE_PROJECT_ID is missing", 'error');
        else addLog(`✅ Project ID: '${config.projectId}' (Check for spaces!)`);
    };

    const testAuth = async () => {
        addLog("--- Testing Authentication ---");
        try {
            addLog("⏳ Opening Popup...");
            const result = await signInWithPopup(auth, googleProvider);
            addLog(`✅ Auth Success! User: ${result.user.email}`);
            addLog(`User UID: ${result.user.uid}`);
        } catch (error) {
            addLog(`❌ Auth Failed: ${error.message}`, 'error');
            console.error(error);
        }
    };

    const testFirestoreWrite = async () => {
        addLog("--- Testing Firestore Write ---");
        if (!auth.currentUser) {
            addLog("⚠️ You must be logged in to test Write (if rules require auth)", 'warning');
        }
        try {
            addLog("⏳ Writing to test_collection/test_doc...");
            await setDoc(doc(db, 'test_collection', 'test_doc'), {
                timestamp: new Date().toISOString(),
                test: "Working"
            });
            addLog("✅ Write Success!");
        } catch (error) {
            addLog(`❌ Write Failed: ${error.message}`, 'error');
            if (error.message.includes("permission-denied")) {
                addLog("👉 This means Firebase is CONNECTED, but Security Rules blocked the write.", 'warning');
            }
        }
    };

    return (
        <div className="p-10 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-5">Firebase Connectivity Debugger</h1>

            <div className="flex flex-col gap-4 mb-8">
                <Button onClick={testConfig} variant="outline">1. Check Config</Button>
                <Button onClick={testAuth} className="bg-blue-600 hover:bg-blue-700">2. Test Google Sign-In</Button>
                <Button onClick={testFirestoreWrite} className="bg-green-600 hover:bg-green-700">3. Test Firestore Write</Button>
            </div>

            <div className="bg-slate-950 text-slate-50 p-4 rounded-lg font-mono text-sm min-h-[300px] overflow-auto">
                {logs.length === 0 && <span className="text-gray-500">Logs will appear here...</span>}
                {logs.map((log, i) => (
                    <div key={i} className={`mb-1 ${log.type === 'error' ? 'text-red-400' :
                            log.type === 'warning' ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                        <span className="text-gray-500">[{log.timestamp}]</span> {log.msg}
                    </div>
                ))}
            </div>

            <div className="mt-5 text-sm text-gray-600">
                <p>If Auth fails with "Project not found", your credentials in .env are wrong or the project is deleted.</p>
                <p>If Write fails with "Permission denied", your Security Rules are blocking writes.</p>
            </div>
        </div>
    );
}
