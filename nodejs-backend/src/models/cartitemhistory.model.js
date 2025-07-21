
    module.exports = function (app) {
        const modelName = 'cartitemhistory';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            id: { type: Schema.Types.Mixed, required: false },
voucherid: { type: Schema.Types.ObjectId, ref: "voucher" },
userid: { type: Schema.Types.ObjectId, ref: "users" },
quantity: { type: Number, required: false, max: 10000000 },
completeddate: { type: Date, required: false },

            
            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true }
          },
          {
            timestamps: true
        });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };