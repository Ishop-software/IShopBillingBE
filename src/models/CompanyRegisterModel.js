import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const companyUserRegister = mongoose.model("companyUserRegister", new Schema ({
    companyUserId: String,
    enter_a_name_of_company: { type: String, required: true },
    address_line1: { type: String, required: true },
    address_line2: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true, maxlength: 6 },
    country_isd: { type: String, required: true },
    taxation_system: { type: String, required: true },
    tax_no: { type: Number, required: true },
    state: { type: String, required: true },
    mobileNo: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, match: /.+\@.+\..+/ },
    website: { type: String, required: true },
    send_data_backup_on_same_maildId: { type: Boolean, default: false },
    trade: { type: String, required: true },
    other: { type: String, required: true },
    engineer_name: { type: String, required: true },
    engineer_contact_no: { type: String },
    auth_partner_code: { type: String },
    date_format: { type: String, default: "DD/MM/YYYY" },
    books_start_on: { type: String },
    year_closing_date: { type: String }
}), "companyUserRegister");