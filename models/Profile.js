import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        photos: [
            {
                type: String, 
            },
        ],
        age: {
            type: Number,
        },
        sex: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
        },
        about_me: {
            type: String,
        },
        height: {
            type: Number,
        },
        job: {
            type: String,
        },
        country: {
            type: String,
        },
        city: {
            type: String,
        },
        hobbies: [
            {
                type: String,
            },
        ],
        zodiac_sign: {
            type: String,
        },
        education: {
            type: String,
        },
        personality_type: {
            type: String,
        },
    },
    { timestamps: true },
);

export default mongoose.model('Profile', ProfileSchema);
