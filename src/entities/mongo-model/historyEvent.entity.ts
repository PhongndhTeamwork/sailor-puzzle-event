import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const historyEventSchema = new Schema(
  {
    address: {
      type: String,
    },
    typeAction: {
      type: String,
    },
    day: {
      type: Number,
    },
    mark: {
      type: String,
    },
    burnerAddress: {
      type: String,
    },
    event: {
      type: Number,
    },
    rank: {
      type: Number,
    },
    txHash: {
      type: String,
    },
    eggPoint: {
      type: Number,
    },
    reward: {
      type: Array,
    },
    time: {
      type: Number,
    },
  },
  { collection: 'HistoryEvent' },
);
const HistoryEventModel = mongoose.model<mongoose.Document>(
  'HistoryEvent',
  historyEventSchema,
);
export { HistoryEventModel, historyEventSchema };
export default HistoryEventModel;
