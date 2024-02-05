import { Router } from "express"
import {register, login, getMe} from "../controllers/auth.js"
import { checkAuth } from "../utils/checkAuth.js"
import { createProfile,updateProfile,deleteProfile,showProfile } from "../controllers/profile.js"

const router = new Router()

// Register
router.post('/register', register)

// Login
router.post('/login', login)

// Get Me 
router.get('/me',checkAuth, getMe)

router.get('/profile/:profileId', showProfile)
router.post('/createProfile', createProfile)
router.put('/updateProfile/:profileId', updateProfile)
router.delete('/deleteProfile/:profileId', deleteProfile)

export default router