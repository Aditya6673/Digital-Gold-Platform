import AuditLog from "../models/AuditLog.mjs";

export const logAudit = async ({
    action,
    performedBy,
    targetModel,
    targetId,
    changes = {}
}) => {
    try {
        await AuditLog.create({
            action,
            performedBy,
            targetModel,
            targetId,
            changes
        });
    } catch (err) {
        console.error('Audit log failed:', err.message);
    }
};
