import mongoose, { Document, Schema } from 'mongoose';

interface IReport extends Document {
  userId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
}

const ReportSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'User' },
  postId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'Post'},
  ownerId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'User' },
});

const ReportModel =  mongoose.model<IReport>('Report', ReportSchema)

export type { IReport };
export default ReportModel;
