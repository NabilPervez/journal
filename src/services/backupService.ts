import { db } from '../db/db';

export const backupService = {
    async createBackup() {
        try {
            const data: Record<string, any[]> = {};

            // Iterate over all tables dynamically
            await Promise.all(
                db.tables.map(async (table) => {
                    data[table.name] = await table.toArray();
                })
            );

            const backup = {
                version: 1,
                timestamp: Date.now(),
                data
            };

            // Create Blob
            const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            // Trigger download
            const a = document.createElement('a');
            a.href = url;
            a.download = `deen-journal-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            return true;
        } catch (e) {
            console.error("Backup failed:", e);
            throw e;
        }
    },

    async restoreBackup(file: File): Promise<void> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async (e) => {
                try {
                    const content = e.target?.result as string;
                    const backup = JSON.parse(content);

                    if (!backup.data || typeof backup.data !== 'object') {
                        throw new Error("Invalid backup file format");
                    }

                    await db.transaction('rw', db.tables, async () => {
                        // Clear existing data first
                        await Promise.all(db.tables.map(table => table.clear()));

                        // Restore data table by table
                        for (const tableName of Object.keys(backup.data)) {
                            const table = db.table(tableName);
                            if (table) {
                                await table.bulkAdd(backup.data[tableName]);
                            }
                        }
                    });

                    resolve();
                } catch (err) {
                    console.error("Restore failed:", err);
                    reject(err);
                }
            };

            reader.onerror = () => reject(new Error("File read error"));
            reader.readAsText(file);
        });
    },

    async clearAllData() {
        await db.transaction('rw', db.tables, async () => {
            await Promise.all(db.tables.map(table => table.clear()));
        });
    }
};
