import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
        match:[/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minlength:6
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    profilePicture:{
        type:String,
        default:''
    },


},
{
    timestamps:true
}
);

// Add virtual for user's ID (for frontend compatibility)
UserSchema.virtual('id').get(function() {
    return this._id.toHexString();
    });

// Ensure virtual fields are serialized
UserSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret.__v;
        delete ret.password; // Don't return password in API responses
    }
});

const User = mongoose.model('User', UserSchema);
export default User;