import mongoose, { Document, Schema } from 'mongoose';

interface IReport extends Document {
  userId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
}

const ReportSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  ownerId: { type: Schema.Types.ObjectId, required: true },
  postId: { type: Schema.Types.ObjectId, required: true },
});

const ReportModel =  mongoose.model<IReport>('Report', ReportSchema)

export type { IReport };
export default ReportModel;
