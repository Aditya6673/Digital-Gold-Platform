import mongoose from 'mongoose';
const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  targetModel: { type: String },
  targetId: { type: mongoose.Schema.Types.ObjectId },
  changes: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false }
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
