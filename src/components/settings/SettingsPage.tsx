import { useState, useRef } from 'react';
import { backupService } from '../../services/backupService';
import { Button } from '../ui/Button';
import { Download, Upload, Trash2, AlertTriangle, CheckCircle, Shield, Archive } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCreateBackup = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await backupService.createBackup();
            setSuccess('Backup downloaded successfully');
        } catch (e) {
            setError('Failed to create backup');
        } finally {
            setLoading(false);
        }
    };

    const handleRestoreBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!confirm("This will overwrite all existing data with the backup. Are you sure?")) {
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await backupService.restoreBackup(file);
            setSuccess('Data restored successfully. Please refresh the page.');
        } catch (e) {
            setError('Failed to restore backup. Invalid file.');
        } finally {
            setLoading(false);
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleClearData = async () => {
        if (!confirm("DANGER: This will permanently delete ALL data. This cannot be undone. Are you absolutely sure?")) {
            return;
        }

        // Double confirmation
        const verify = prompt("Type 'DELETE' to confirm deletion:");
        if (verify !== 'DELETE') return;

        setLoading(true);
        try {
            await backupService.clearAllData();
            setSuccess('All data deleted successfully.');
            setTimeout(() => window.location.reload(), 1500);
        } catch (e) {
            setError('Failed to clear data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto pb-32 px-4 pt-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-slate-800 rounded-xl text-gold">
                    <Archive size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-heading text-starlight">Settings</h1>
                    <p className="text-slate-400">Manage your data and preferences</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Status Messages */}
                <AnimatePresence>
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-emerald-900/30 border border-emerald-500/50 text-emerald-200 p-4 rounded-xl flex items-center gap-3"
                        >
                            <CheckCircle size={20} />
                            <span>{success}</span>
                        </motion.div>
                    )}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-crimson/20 border border-crimson/50 text-crimson p-4 rounded-xl flex items-center gap-3"
                        >
                            <AlertTriangle size={20} />
                            <span>{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Backup Card */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-2 bg-slate-800 rounded-lg text-indigo-400">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h3 className="font-heading text-xl text-starlight mb-1">Data Backup</h3>
                            <p className="text-sm text-slate-400">Your data is stored locally on this device. Create backups regularly to prevent data loss.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Button
                            onClick={handleCreateBackup}
                            disabled={loading}
                            className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-starlight border border-slate-700"
                        >
                            <Download className="mr-3 h-5 w-5 text-gold" />
                            Export Data to JSON
                        </Button>

                        <div className="relative">
                            <input
                                type="file"
                                accept=".json"
                                ref={fileInputRef}
                                onChange={handleRestoreBackup}
                                className="hidden"
                                id="restore-input"
                            />
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={loading}
                                className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-starlight border border-slate-700"
                            >
                                <Upload className="mr-3 h-5 w-5 text-indigo-400" />
                                Import Data from Backup
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-crimson/5 border border-crimson/20 rounded-xl p-6">
                    <h3 className="font-heading text-lg text-crimson mb-2">Danger Zone</h3>
                    <p className="text-sm text-slate-400 mb-6">Review your actions carefully. These operations cannot be undone.</p>

                    <Button
                        onClick={handleClearData}
                        variant="danger"
                        disabled={loading}
                        className="w-full justify-start"
                    >
                        <Trash2 className="mr-3 h-5 w-5" />
                        Delete All Data (Reset App)
                    </Button>
                </div>
            </div>

            <div className="mt-12 text-center text-xs text-slate-600">
                <p>The Deen Journal v2.0.0</p>
                <p>Local-first, encrypted, and private by design.</p>
            </div>
        </div>
    );
}
