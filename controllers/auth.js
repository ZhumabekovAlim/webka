    import User from "../models/User.js"
    import bcrypt from "bcryptjs"
    import jwt from "jsonwebtoken"

    // Register user
    export const register = async (req, res) => {
        try {
            const { username, password } = req.body
            if (typeof username != "string" || typeof password != "string"){
                res.send("Invalid parameters!");
                res.end();
                return;
            }

            const isUsed = await User.findOne({ username }).toArray((err, documents) => {
                if (err) {
                  console.error('Error finding documents:', err);
                } else {
                  console.log('Documents found:', documents);
                }
              });
            

            if(isUsed) {
                return res.json({
                    message:'This user alredy exists!'
                })
            }

            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)

            const newUser = new User({
                username,
                password: hash
            })

            const token = jwt.sign(
                {
                    id: newUser._id,
                },
                process.env.JWT_SECRET,
                { expiresIn: '30d' },
            )

            try {
                await newUser.save();
                console.log('User saved successfully:', newUser);
            } catch (error) {
                console.error('Error saving user:', error);
            }

            res.json({
                token,
                newUser,
                message: "Registration success!"
            })
        }catch(error){
            res.json({ message: "Error when creating a user!"})
        }
    }

    // Login user
    export const login = async (req, res) => {
        try {
            const { username, password } = req.body
            const user = await User.findOne({ username})
            if (typeof username != "string" || typeof password != "string"){
                res.send("Invalid parameters!");
                res.end();
                return;
               }

            if(!user) {
                return res.json({
                    message:'This user is not registered!'
                })
            }

            const isPasswordCorrect = await bcrypt.compare(password,user.password)  

            if(!isPasswordCorrect) {
                return res.json({
                    message:'Password is incorrect!',
                })
            }

            const token = jwt.sign(
                {
                    id: user._id,
                    username: username
                },
                process.env.JWT_SECRET,
                { expiresIn: '30d' },
            )

            res.json({
                token,
                user,
                message: "Login success!"
            })

        }catch(error){
            res.json({ message: "Error logging in!"})
        }
        
    }

    // Get Me
    export const getMe = async (req, res) => {
        try {
            const user = await User.findById(req.userId).toArray((err, documents) => {
        if (err) {
            console.error('Error finding documents:', err);
        } else {
            console.log('Documents found:', documents);
            }
        });

            if(!user) {
                return res.json({
                    message:'This user is not registered!'
                })
            }

            const token = jwt.sign(
                {
                    id: user._id,
                },
                process.env.JWT_SECRET,
                { expiresIn: '30d' },
            )

            res.json({
                user,
                token
            })
        }catch(error){
            res.json({ message: "Not access."})
        }
    }

    export default getMe;