
    module.exports = function (app) {
        const modelName = 'voucher';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            id: { type:  String , required: true },
categoryid: { type: Schema.Types.ObjectId, ref: "category" },
points: { type:  String , required: true },
title: { type:  String , required: true },
image: { type:  String , maxLength: 150, index: true, trim: true, default: "" },
description: { type:  String , required: true, default: "" },
Termsandcondition: { type:  String , maxLength: 150, index: true, trim: true, default: "" },

            
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