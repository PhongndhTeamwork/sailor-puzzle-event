import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const AccountEventSchema = new Schema(
  {
    address: {
      type: String,
    },
    dailyData: {
      type: Array,
    },
    claimLeaderboard: {
      type: Array,
    },
    eggPoint: {
      total: { type: Number },
      used: { type: Number },
      holding: { type: Number },
    },
    mintData: {
      minted: { type: Boolean },
      txHash: { type: String },
    },
    socialQuest: { type: Boolean },
  },
  { collection: 'AccountEvent' },
);
const AccountEventModel = mongoose.model<mongoose.Document>(
  'AccountEvent',
  AccountEventSchema,
);
export { AccountEventModel, AccountEventSchema };
export default AccountEventModel;
