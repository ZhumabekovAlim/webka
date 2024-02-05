import Profile from "../models/Profile.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import mongoose from 'mongoose';

// Create Profile
export const createProfile = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.body.user);

        const existingProfile = await Profile.findOne({ user: userId });

        if (existingProfile) {
            return res.json({
                message: 'Profile already exists for this user!',
            });
        }

        const newProfile = new Profile({
            user: userId,
            photos: req.body.photos,
            age: req.body.age,
            sex: req.body.sex,
            about_me: req.body.about_me,
            height: req.body.height,
            job: req.body.job,
            country: req.body.country,
            city: req.body.city,
            hobbies: req.body.hobbies,
            zodiac_sign: req.body.zodiac_sign,
            education: req.body.education,
            personality_type: req.body.personality_type,
        });

        await newProfile.save();

        const token = jwt.sign(
            {
                userId,
                profileId: newProfile._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' },
        );

        res.json({
            token,
            newProfile,
            message: 'Profile creation success!',
        });
    } catch (error) {
        console.error(error);
        res.json({ message: 'Error when creating a profile!' });
    }
};

//Update Profile
export const updateProfile = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.body.user);
        const profileId = req.params.profileId; 

        const updatedProfile = await Profile.findByIdAndUpdate(
            profileId,
            {
                $set: {
                    photos: req.body.photos,
                    age: req.body.age,
                    sex: req.body.sex,
                    about_me: req.body.about_me,
                    height: req.body.height,
                    job: req.body.job,
                    country: req.body.country,
                    city: req.body.city,
                    hobbies: req.body.hobbies,
                    zodiac_sign: req.body.zodiac_sign,
                    education: req.body.education,
                    personality_type: req.body.personality_type,
                },
            },
            { new: true }
        );

        if (!updatedProfile) {
            return res.json({
                message: 'Profile not found!',
            });
        }

        res.json({
            updatedProfile,
            message: 'Profile update success!',
        });
    } catch (error) {
        console.error(error);
        res.json({ message: 'Error when updating a profile!' });
    }
};


//Delete Profile
export const deleteProfile = async (req, res) => {
    try {
        const profileId = req.params.profileId; 

        const deletedProfile = await Profile.findByIdAndDelete(profileId);

        if (!deletedProfile) {
            return res.json({
                message: 'Profile not found!',
            });
        }

        res.json({
            deletedProfile,
            message: 'Profile deletion success!',
        });
    } catch (error) {
        console.error(error);
        res.json({ message: 'Error when deleting a profile!' });
    }
};


//Show Profile
export const showProfile = async (req, res) => {
    try {
        const profileId = req.params.profileId; 

        const profile = await Profile.findById(profileId);

        if (!profile) {
            return res.json({
                message: 'Profile not found!',
            });
        }

        res.json({
            profile,
            message: 'Profile retrieval success!',
        });
    } catch (error) {
        console.error(error);
        res.json({ message: 'Error when retrieving a profile!' });
    }
};
