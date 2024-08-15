import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const processEventSchema = new Schema(
  {
    address: {
      type: String,
    },
    day: {
      type: Number,
    },
    taskIndex: {
      type: Number,
    },
    eggPoint: {
      type: Number,
    },
    checked: {
      type: Boolean,
    },
    time: {
      type: Number,
    },
  },
  { collection: 'ProcessEvent' },
);
const ProcessEventModel = mongoose.model<mongoose.Document>(
  'ProcessEvent',
  processEventSchema,
);
export { ProcessEventModel, processEventSchema };
export default ProcessEventModel;
