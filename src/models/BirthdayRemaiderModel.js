import mongoose from "mongoose";

var Schema = mongoose.Schema;

export const birthdayRemainder = mongoose.model(
  "BirthdayRemainder",
  new Schema(
    {
      BrId: String,  
      name: String,
      event: String,
      on: String,
      city: String,
      contact_person: String,
      mobile: String,
      phone: String,
      email: String,
    },
    { timestamps: true }
  ),
  "BirthdayRemainder"
);
