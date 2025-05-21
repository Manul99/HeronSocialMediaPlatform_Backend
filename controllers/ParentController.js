const asyncHandler = require('express-async-handler');
const Parents = require('../models/Parents');
const Messages = require('../models/Messageing');
const Clubs = require('../models/Clubs');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
//Assign a child to a parent
const assignChild = asyncHandler(async (req,res) => {
   try {
    const{childId, level} = req.body;
    const parentId = req.user.id;

    if(!childId){
        return res.status(400).json({message:"Child Id is required"});
    }

    const restrictions = {
        canViewMessages: level >= 1,
        canApproveFriends: level >=2,
        canMonitorActivities: level === 3
    };

    const parentEntry = new Parents({
        parentId,
        childId,
        restrictions
    });

    await parentEntry.save();

    res.status(201).json({message:"Child assigned to parent", parentEntry});
   } catch (error) {
    console.error("Error during assigning :", error);
    res.status(500).json({ message: "Internal server error" });
   }
});

//Parent can track using this
const getParentOverview = asyncHandler(async (req,res) => {
   try {
    const parentId = req.user.id;
    

    const parentData = await Parents.findOne({parentId}).populate('childId');

    if(!parentData){
        return res.status(404).json({message:"No access this child"});
    }

    const childId = parentData.childId._id;

    const messages = await Messages.find({
        $or:[{senderId: childId}, {receiverId: childId}]
    }).sort({createdAt: -1});

    const clubs = await Clubs.find({members: childId});

    const overview = {
        childInfo: parentData.childId,
        restrictions: parentData.restrictions,
        messages,
        clubs
    };

    res.status(200).json(overview);
   } catch (error) {
    console.error("Error during get parent overview :", error);
    res.status(500).json({ message: "Internal server error" });
   }
});

//Update parent restrctions
const updateRestrictions = asyncHandler(async (req,res) => {
    try {
    const parentId = req.user.id;
    const {childId} = req.params;
    const {level} = req.body;

    const parentEntry = await Parents.findOne({parentId, childId});

    if(!parentEntry){
        return res.status(404).json({message:"Parent-child record not found"});
    }

    parentEntry.restrictions = {
        canViewMessages: level >= 1,
        canApproveFriends: level >=2,
        canMonitorActivities: level === 3
    };

    await parentEntry.save();

    res.status(200).json({message:"Restrictions updated", parentEntry});
    } catch (error) {
        console.error("Error during update restrictions :", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

const registerParent = asyncHandler(async (req,res) => {
    try {
        const { userName, email, password, children } = req.body;

        const existingParent = await Parents.findOne({ email });

        if (existingParent) {
            return res.status(400).json({ message: 'Parent already exists' });
        }
      

        const hashedPassword = await bcrypt.hash(password, 10);

         const newParent = new Parents({
            userName,
            email,
            password: hashedPassword,
            children,
        });

        await newParent.save();
        res.status(201).json({ message: 'Parent registered successfully', parent: newParent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

const googleLoginCallBack = asyncHandler(async(req,res) =>{
    try {
        let parent = await Parents.findOne({ googleId: profile.id });

        if (!parent) {
            const existingUser = await User.findOne({ email: profile.emails[0].value });
            if (existingUser) return done(null, false, { message: 'Email already registered' });

            // Create Parent
            parent = new Parents({
                userName: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                children: []
            });

            await parent.save();

            // Also create user entry
            const user = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                role: 'parent'
            });

            await user.save();
        }

        return done(null, parent);
    } catch (error) {
        
    }
});

const parentLogin = asyncHandler(async (req, res) => {
    const {userName, password} = req.body;
    const JWT_SECRECT = 'manuss' 
    try {
        const user = await Parents.findOne({ userName });

        if(!user){
            res.status(404).json({message:'User not Found'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({message:'Invalid Password'});
        }

        const token = jwt.sign({ id: user._id.toString() }, JWT_SECRECT, { expiresIn: '1h' });
        res.status(200).json({token,user});
    } catch (error) {
        console.log('Error during login', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


const requestPasswordResetWithOTP = asyncHandler(async(req,res) =>{
    const startTime = new Date().getTime();

    const{email} = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try{

        const user = await Parents.findOne({email});

        if(!user){
            return res.status(404).json({message:'User not found'});
        }
    
        //Generate OTP
    
        const otp = Math.floor(100000 + Math.random() * 900000);
    
        user.resetOTP = otp;
        user.resetOTPExpiration = Date.now() + 600000;
    
        await user.save();
    
        // Send an email with the reset link containing the token
    
        const transporter = nodemailer.createTransport({
            service:'gmail',
            host: "smtp.gmail.com",
            port:465,
            secure: true,
            auth: {
                user: 'manulperera5@gmail.com',
                pass: 'lksr heqd wwoz dmsb',
            },
            tls:{
                rejectUnauthorized:false
            }
        });
    
      
        const mailOptions = {
            from: {
                name:'Heron SocialMedia Platform',
                address:'manulperera5@gmail.com'
            },
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`,
        };
    
        transporter.sendMail(mailOptions,(error,info) =>{
            if(error){
                console.error('Error sending email',error);
                return res.status(500).json({message:'Failed to send OTP email'});
            }

            const endTime = new Date().getTime();
        console.log('Backend response time:', endTime - startTime, 'ms');
    
            res.status(200).json({message:'OTP sent successfully'});
        })
    }catch (error) {
        console.error('Error requesting password reset', error);
        res.status(500).json({ message: 'Failed to request password reset' });
    }
       
})


const verifyOTPAndPassword = asyncHandler(async(req,res) =>{
    const {email,otp} = req.body;
 
    console.log("Request Body:", req.body);  // Debugging line to see the entire request body
 
    if (!email) {
        console.log("Email not received");
        return res.status(400).json({ message: 'Email not received' });
    }
 
    if (!otp) {
        console.log("OTP not received");
        return res.status(400).json({ message: 'OTP not received' });
    }
 
    console.log("Received email:", email);
    console.log("Received OTP:", otp);
 
    const user = await Parents.findOne({ email: email.toLowerCase() });  // Ensure email is in lowercase
 
    console.log("User:", user);
 
    if(!user) {
        console.log("User not found");
        return res.status(400).json({ message: 'User not found' });
    }
 
   if (Number(user.resetOTP) !== Number(otp)) {
        console.log("Invalid OTP");
        return res.status(400).json({ message: 'Invalid OTP' });
    }

 
    if(user.resetOTPExpiration < Date.now()) {
        console.log("Expired OTP");
        return res.status(400).json({ message: 'Expired OTP' });
    }
 
    user.resetOTP = null;
    user.resetOTPExpiration = null;
 
    await user.save();
 
    res.status(200).json({ message: 'OTP verified successfully!' });
 })


 // New password
const updatePassword = asyncHandler(async(req,res) =>{
    const {email, newPassword} = req.body;

    const user = await Parents.findOne({ email });

    if(!user){
        return res.status(404).json({message:'User not found'});
    }

    // Hash the password and update user's password
    const hashedPassword = await bcrypt.hash(newPassword,10);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({message:'Password updated successfully!'});
});

module.exports = {assignChild,getParentOverview,updateRestrictions,registerParent,googleLoginCallBack,parentLogin,requestPasswordResetWithOTP,
    verifyOTPAndPassword,updatePassword
};