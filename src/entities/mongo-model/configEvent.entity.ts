import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const configEventSchema = new Schema(
  {
    key: {
      type: String,
    },
    dataConfig: {
      type: Array,
    },
    metaData: {
      type: {},
    },
  },
  { collection: 'ConfigEvent' },
);
const ConfigEventModel = mongoose.model<mongoose.Document>(
  'ConfigEvent',
  configEventSchema,
);
export { ConfigEventModel, configEventSchema };
export default ConfigEventModel;
